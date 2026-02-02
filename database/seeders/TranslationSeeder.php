<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class TranslationSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/translations');
        $files = File::files($path);

        foreach ($files as $file) {
            $locale = pathinfo($file, PATHINFO_FILENAME); // 'en', 'ar', etc.
            $translations = require $file;

            foreach ($translations as $key => $value) {
                DB::table('translations')->updateOrInsert(
                    ['locale' => $locale, 'key' => $key],
                    ['value' => $value, 'is_default' => $locale === 'en' ? 1 : 0, 'updated_at' => now(), 'created_at' => now()]
                );
            }
        }
    }
}
