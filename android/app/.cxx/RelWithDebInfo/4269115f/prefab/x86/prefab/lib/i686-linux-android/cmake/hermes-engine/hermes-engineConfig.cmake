if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/sonoma/.gradle/caches/8.10.2/transforms/ae43b2493f078ec870ea7d34c45ec282/transformed/hermes-android-0.76.3-release/prefab/modules/libhermes/libs/android.x86/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/sonoma/.gradle/caches/8.10.2/transforms/ae43b2493f078ec870ea7d34c45ec282/transformed/hermes-android-0.76.3-release/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

