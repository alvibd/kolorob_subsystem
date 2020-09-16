<?php

namespace Tests\Feature;

use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    /**
     * @test
     */
    public function loginErrors()
    {
        $user = factory(User::class)->make();

        $response = $this->postJson("/api/login", ['email' => $user->email, 'password' => 'password']);

        $response->assertUnauthorized();
    }

    /**
     * @test
     */
    public function loginSuccessful()
    {
        $response = $this->postJson("/api/login", ['email' => 'superadministrator@app.com ', 'password' => 'password']);

        $response->assertJsonStructure(['access_token', 'token_type', 'expires_in']);
    }
}
