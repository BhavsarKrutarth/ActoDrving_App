
/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * @generated by codegen project: GeneratePropsCpp.js
 */

#include <react/renderer/components/lottiereactnative/Props.h>
#include <react/renderer/core/PropsParserContext.h>
#include <react/renderer/core/propsConversions.h>

namespace facebook::react {

LottieAnimationViewProps::LottieAnimationViewProps(
    const PropsParserContext &context,
    const LottieAnimationViewProps &sourceProps,
    const RawProps &rawProps): ViewProps(context, sourceProps, rawProps),

    resizeMode(convertRawProp(context, rawProps, "resizeMode", sourceProps.resizeMode, {})),
    renderMode(convertRawProp(context, rawProps, "renderMode", sourceProps.renderMode, {})),
    sourceName(convertRawProp(context, rawProps, "sourceName", sourceProps.sourceName, {})),
    sourceJson(convertRawProp(context, rawProps, "sourceJson", sourceProps.sourceJson, {})),
    sourceURL(convertRawProp(context, rawProps, "sourceURL", sourceProps.sourceURL, {})),
    sourceDotLottieURI(convertRawProp(context, rawProps, "sourceDotLottieURI", sourceProps.sourceDotLottieURI, {})),
    imageAssetsFolder(convertRawProp(context, rawProps, "imageAssetsFolder", sourceProps.imageAssetsFolder, {})),
    progress(convertRawProp(context, rawProps, "progress", sourceProps.progress, {0.0})),
    speed(convertRawProp(context, rawProps, "speed", sourceProps.speed, {0.0})),
    loop(convertRawProp(context, rawProps, "loop", sourceProps.loop, {false})),
    autoPlay(convertRawProp(context, rawProps, "autoPlay", sourceProps.autoPlay, {false})),
    enableMergePathsAndroidForKitKatAndAbove(convertRawProp(context, rawProps, "enableMergePathsAndroidForKitKatAndAbove", sourceProps.enableMergePathsAndroidForKitKatAndAbove, {false})),
    enableSafeModeAndroid(convertRawProp(context, rawProps, "enableSafeModeAndroid", sourceProps.enableSafeModeAndroid, {false})),
    hardwareAccelerationAndroid(convertRawProp(context, rawProps, "hardwareAccelerationAndroid", sourceProps.hardwareAccelerationAndroid, {false})),
    cacheComposition(convertRawProp(context, rawProps, "cacheComposition", sourceProps.cacheComposition, {false})),
    colorFilters(convertRawProp(context, rawProps, "colorFilters", sourceProps.colorFilters, {})),
    dummy(convertRawProp(context, rawProps, "dummy", sourceProps.dummy, {})),
    textFiltersAndroid(convertRawProp(context, rawProps, "textFiltersAndroid", sourceProps.textFiltersAndroid, {})),
    textFiltersIOS(convertRawProp(context, rawProps, "textFiltersIOS", sourceProps.textFiltersIOS, {}))
      {}

} // namespace facebook::react