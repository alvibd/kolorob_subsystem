<?php

namespace App\Http\Controllers;

use App\Post;
use App\PostContent;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Resources\Post as PostResource;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $posts = Post::all()->load('postContents');

        return PostResource::collection($posts);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'caption' => 'required|string|max:150',
            'description' => 'nullable|string|max:250',
            // 'file_type' => [
            //     'required',
            //     'string',
            //     Rule::in(['pdf', 'image', 'video'])
            // ],
            // 'file' => 'required|mime:jpg,jpeg,png,gif,mp4,mov,avi,mkv,mpeg,pdf'
        ]);

        $post = new Post();

        $post->caption = $request->caption;
        $post->description = $request->description;

        $post->saveOrFail();

        return response(['message' => 'Successfully created post.','id' => $post->id], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function uploadMedia(Post $post, Request $request)
    {
        $this->validate($request, [
            'file_type'=> [
                'required',
                Rule::in(['.pdf', 'image/*', 'video/*'])
            ],
            'files' => 'required|array|min:1',
            'files.*' => [
                'required',
                'file',
                'mimetypes:image/jpeg,image/png,image/gif,application/mp4,video/x-msvideo,video/x-matroska,application/pdf',
                function($attribute, $value, $fail){

                    $file_type = request()->get('file_type');

                    if($file_type == '.pdf' && explode('.', $value->name)[1] != 'pdf')
                    {
                        $fail($attribute.' does not match the file type.');
                    }
                    elseif($file_type == 'image/*' && !in_array(explode('.', $value->name)[1], ['jpeg','jpg','png','gif']))
                    {
                        $fail($attribute.' does not match the file type.');
                    }
                    elseif($file_type == 'video/*' && !in_array(explode('.', $value->name)[1], ['mp4','avi','mkv']))
                    {
                        $fail($attribute.' does not match the file type.');
                    }
                }
            ]
        ]);

        if($request->file_type == '.pdf' && $request->hasFile('files'))
        {
            foreach($request->file('files') as $file)
            {

                $path = $file->store('public/documents');
                // ltrim($path, 'public/documents')
                $content = new PostContent();

                $content->file_name = ltrim($path, 'public/documents');
                $content->file_type = 'document';
                $content->post()->associate($post);

                $content->saveOrFail();
            }
        }
        elseif($request->file_type == 'image/*' && $request->hasFile('files'))
        {
            foreach($request->file('files') as $file)
            {
                $path = $file->store('public/images');

                $content = new PostContent();

                $content->file_name = ltrim($path, 'public/images');
                $content->post()->associate($post);

                $content->saveOrFail();
            }
        }
        elseif($request->file_type == 'video/*' && $request->hasFile('files'))
        {
            foreach($request->file('files') as $file)
            {
                $filenameWithExt = $file->getClientOriginalName();
                // Get just filename
                $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
                // Get just ext
                $extension = $file->getClientOriginalExtension();
                // Filename to store
                $fileNameToStore= $filename.'_'.time().'.'.$extension;
                // Upload Image
                $path = $file->storeAs('public/videos', $fileNameToStore);

                $content = new PostContent();

                $content->file_name = $fileNameToStore;
                $content->file_type = 'video';
                $content->post()->associate($post);

                $content->saveOrFail();
            }
        }


        return response(['message' => 'success', 'path' => 'storage/odocuments']);
    }

}
