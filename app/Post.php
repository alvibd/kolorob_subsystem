<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    public function postContents()
    {
        return $this->hasMany(PostContent::class);
    }
}
