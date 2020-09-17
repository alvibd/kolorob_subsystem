<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\PostContent as PostContentResource;

class Post extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // dump($request->path());
        return [
            'id' => $this->id,
            'caption' => $this->caption,
            'description' => $this->description,
            'view_count' => $this->view_count,
            'thumbnail' => new PostContentResource($this->postContents->first()),
            'post_contents' => PostContentResource::collection($this->whenLoaded('postContents'))
        ];
    }
}
