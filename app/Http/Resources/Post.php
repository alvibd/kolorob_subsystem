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
        return [
            'caption' => $this->caption,
            'description' => $this->description,
            'view_count' => $this->view_count,
            'post_contents' => PostContentResource::collection($this->postContents)
        ];
    }
}
