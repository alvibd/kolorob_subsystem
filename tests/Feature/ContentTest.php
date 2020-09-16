<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Post;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ContentTest extends TestCase
{
    use RefreshDatabase;

    private $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();

        $this->user = factory(User::class)->create();
        $this->user->attachRole('superadministrator');
    }

    /**
     * @test
     */
    public function only_admin_can_create_post()
    {
        $user = factory(User::class)->create();
        $user->attachRole('user');

        $token = JWTAuth::fromUser($user);

        $post = factory(Post::class)->make();

        // Storage::fake('posts');


        $response = $this->withHeaders(['Authorization' => "Bearer {$token}"])
                         ->postJson('/api/create_post',[
                             'caption' => null,
                             'description' => $post->description,
                            //  'file[1]' => UploadedFile::fake()->image('blog.jpg')
                         ]);

        $response->assertForbidden();
    }

    /**
     * @test
     */
    public function validate_content_caption()
    {

        $post = factory(Post::class)->make();
        // dd($user);

        $token = JWTAuth::fromUser($this->user);

        // Storage::fake('posts');


        $response = $this->withHeaders(['Authorization' => "Bearer {$token}"])
                         ->postJson('/api/create_post',[
                             'caption' => null,
                             'description' => $post->description,
                            //  'file[1]' => UploadedFile::fake()->image('blog.jpg')
                         ]);

        // Storage::disk('posts')->assertExists('blog.jpg');
        $response->assertJsonValidationErrors(['caption']);

        $response = $this->withHeaders(['Authorization' => "Bearer {$token}"])
                         ->postJson('/api/create_post',[
                             'caption' => 123,
                             'description' => $post->description,
                            //  'file[1]' => UploadedFile::fake()->image('blog.jpg')
                         ]);

        $response->assertJsonValidationErrors(['caption']);

    }

    /**
     * @test
     */
    public function validate_post_description()
    {
        $post = factory(Post::class)->make();

        $token = JWTAuth::fromUser($this->user);

        $response = $this->withHeaders(['Authorization' => "Bearer {$token}"])
                         ->postJson('/api/create_post',[
                             'caption' => $post->caption,
                             'description' => 1234,
                         ]);

        $response->assertJsonValidationErrors(['description']);
    }

    /**
     * @test
     */
    public function post_creation_successful()
    {
        $post = factory(Post::class)->make();

        $token = JWTAuth::fromUser($this->user);

        $response = $this->withHeaders(['Authorization' => "Bearer {$token}"])
                         ->postJson('/api/create_post',[
                             'caption' => $post->caption,
                             'description' => $post->description,
                         ]);

        $response->assertJsonStructure(['message', 'id'])->assertOk();

        $this->assertDatabaseCount('posts', 1);
    }

    /**
     * @test
     */
    public function validate_field_type()
    {
        $post = factory(Post::class)->create();

        $token = JWTAuth::fromUser($this->user);

        Storage::fake('posts');

        $response = $this->withHeaders(['Authorization' => "Bearer {$token}"])
                        ->postJson('/api/create_post/'.$post->id.'/upload', [
                            'file_type' => null,
                            'files' => null,
                        ]);

        $response->assertJsonValidationErrors(['file_type', 'files']);

        $file = UploadedFile::fake()->image('avatar.jpg');

        $response = $this->withHeaders(['Authorization' => "Bearer {$token}"])
                        ->postJson('/api/create_post/'.$post->id.'/upload', [
                            'file_type' => 'not_file_type',
                            'files' => [$file],
                        ]);

        $response->assertJsonValidationErrors(['file_type']);
    }

    /**
     * @test
     */
    public function validate_file_type_matches_file()
    {
        $post = factory(Post::class)->create();

        $token = JWTAuth::fromUser($this->user);

        Storage::fake('posts');

        $file = UploadedFile::fake()->image('avatar.jpg');

        $response = $this->withHeaders(['Authorization' => "Bearer {$token}"])
                        ->postJson('/api/create_post/'.$post->id.'/upload', [
                            'file_type' => '.pdf',
                            'files' => [$file],
                        ]);

        // $response->dump();

        $response->assertJsonValidationErrors(['files.0']);
    }

    /**
     * @test
     */
    public function validate_upload_media_successful()
    {
        $post = factory(Post::class)->create();

        $token = JWTAuth::fromUser($this->user);

        Storage::fake('posts');

        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        $response = $this->withHeaders(['Authorization' => "Bearer {$token}"])
                        ->postJson('/api/create_post/'.$post->id.'/upload', [
                            'file_type' => '.pdf',
                            'files' => [$file],
                        ]);

        $response->assertOk();

        Storage::disk('local')->assertExists($file->hashName('public/documents'));

        $this->assertDatabaseCount('post_contents', 1);

        $file = UploadedFile::fake()->create('caution.mp4', 2000000, 'application/mp4');

        $file1 = UploadedFile::fake()->create('caution.mkv', 2000000, 'video/x-matroska');

        $response = $this->withHeaders(['Authorization' => "Bearer {$token}"])
                        ->postJson('/api/create_post/'.$post->id.'/upload', [
                            'file_type' => 'video/*',
                            'files' => [$file, $file1],
                        ]);

        $response->assertOk();

        $this->assertDatabaseCount('post_contents', 3);

        Storage::disk('local')->assertExists('public/videos/caution_'.time().'.mp4');
        Storage::disk('local')->assertExists('public/videos/caution_'.time().'.mkv');

        $file = UploadedFile::fake()->image('image.jpg');

        $response = $this->withHeaders(['Authorization' => "Bearer {$token}"])
                        ->postJson('/api/create_post/'.$post->id.'/upload', [
                            'file_type' => 'image/*',
                            'files' => [$file],
                        ]);

        $response->assertOk();

        Storage::disk('local')->assertExists($file->hashName('public/images'));
        $this->assertDatabaseCount('post_contents', 4);
    }
}
