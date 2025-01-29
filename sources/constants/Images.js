import { useTheme } from "../common/RNThemeContext";

const CategoryPath = "../assets/images/Category/";
const NavigationPath = "../assets/images/Navigation/";
const imagePath = "../assets/images/";
const iconpath = "../assets/images/ScreenIcone/";

const png = ".png";
const jpg = ".jpg";
const colorScheme = useTheme();

const Images = {
  selected: require(imagePath + "selected" + png),
  car: require(imagePath + "car" + png),
  star1: require(imagePath + "star" + png),
  home: require(NavigationPath + "home" + png),
  motorcyclethumbnail: require(CategoryPath + "motorcycle" + png),
  carthumbnail: require(CategoryPath + "car" + png),
  hgvthumbnail: require(CategoryPath + "hgv" + png),
  pcvthumbnail: require(CategoryPath + "pcv" + png),
  adithumbnail: require(CategoryPath + "adi" + png),
  profile:
    colorScheme === "dark"
      ? require(imagePath + "profile1" + png)
      : require(imagePath + "profile" + png),
  eyeoff:
    colorScheme === "dark"
      ? require(imagePath + "eye-off" + png)
      : require(imagePath + "eye-off1" + png),
  eyeon:
    colorScheme === "dark"
      ? require(imagePath + "eye-on" + png)
      : require(imagePath + "eye-on1" + png),
  setting:
    colorScheme === "dark"
      ? require(imagePath + "setting2" + png)
      : require(imagePath + "setting1" + png),
  close:
    colorScheme === "dark"
      ? require(imagePath + "close1" + png)
      : require(imagePath + "close" + png),
  insurance:
    colorScheme === "dark"
      ? require(imagePath + "insurance2" + png)
      : require(imagePath + "insurance1" + png),
  terms:
    colorScheme === "dark"
      ? require(imagePath + "terms1" + png)
      : require(imagePath + "terms" + png),
  star:
    colorScheme === "dark"
      ? require(imagePath + "star2" + png)
      : require(imagePath + "star1" + png),
  about:
    colorScheme === "dark"
      ? require(imagePath + "about1" + png)
      : require(imagePath + "about" + png),
  share:
    colorScheme === "dark"
      ? require(imagePath + "shareWhite" + png)
      : require(imagePath + "share" + png),
  Logout:
    colorScheme === "dark"
      ? require(iconpath + "Dark_Logout" + png)
      : require(iconpath + "Light_Logout" + png),
  mocktest:
    colorScheme === "dark"
      ? require(imagePath + "mocktest2" + png)
      : require(imagePath + "mocktest1" + png),
  topics:
    colorScheme === "dark"
      ? require(imagePath + "topics2" + png)
      : require(imagePath + "topics1" + png),
  mistake:
    colorScheme === "dark"
      ? require(imagePath + "mistake2" + png)
      : require(imagePath + "mistake1" + png),
  hazard:
    colorScheme === "dark"
      ? require(imagePath + "hazard2" + png)
      : require(imagePath + "hazard1" + png),
  highwaycode:
    colorScheme === "dark"
      ? require(imagePath + "highwaycode2" + png)
      : require(imagePath + "highwaycode1" + png),
  signs:
    colorScheme === "dark"
      ? require(imagePath + "signs" + png)
      : require(imagePath + "signs" + png),
  f_learn:
    colorScheme === "dark"
      ? require(NavigationPath + "f_learn2" + png)
      : require(NavigationPath + "f_learn1" + png),
  learn:
    colorScheme === "dark"
      ? require(NavigationPath + "learn2" + png)
      : require(NavigationPath + "learn1" + png),
  f_Clip:
    colorScheme === "dark"
      ? require(NavigationPath + "f_Clip2" + png)
      : require(NavigationPath + "f_Clip1" + png),
  clips:
    colorScheme === "dark"
      ? require(NavigationPath + "clips1" + png)
      : require(NavigationPath + "clips2" + png),
  share1:
    colorScheme === "dark"
      ? require(NavigationPath + "share2" + png)
      : require(NavigationPath + "share1" + png),
  f_location:
    colorScheme === "dark"
      ? require(NavigationPath + "f_location2" + png)
      : require(NavigationPath + "f_location1" + png),
  location:
    colorScheme === "dark"
      ? require(NavigationPath + "location2" + png)
      : require(NavigationPath + "location1" + png),
  leftarrow:
    colorScheme === "dark"
      ? require(imagePath + "left-arrow1" + png)
      : require(imagePath + "left-arrow" + png),
  customersatisfaction:
    colorScheme === "dark"
      ? require(imagePath + "customer-satisfaction1" + png)
      : require(imagePath + "customer-satisfaction" + png),
  motorcycle:
    colorScheme === "dark"
      ? require(CategoryPath + "motorcycle2" + png)
      : require(CategoryPath + "motorcycle1" + png),
  cars:
    colorScheme === "dark"
      ? require(CategoryPath + "car2" + png)
      : require(CategoryPath + "car1" + png),
  hgv:
    colorScheme === "dark"
      ? require(CategoryPath + "hgv2" + png)
      : require(CategoryPath + "hgv1" + png),
  pcv:
    colorScheme === "dark"
      ? require(CategoryPath + "pcv2" + png)
      : require(CategoryPath + "pcv1" + png),
  adi:
    colorScheme === "dark"
      ? require(CategoryPath + "adi2" + png)
      : require(CategoryPath + "adi1" + png),
  email:
    colorScheme === "dark"
      ? require(iconpath + "Dark_Email" + png)
      : require(iconpath + "Light_Email" + png),
  otpscreen:
    colorScheme === "dark"
      ? require(iconpath + "dark_otpScreen" + png)
      : require(iconpath + "Light_otpscreen" + png),
  Success:
    colorScheme === "dark"
      ? require(iconpath + "Dark_Success" + png)
      : require(iconpath + "Light_Success" + png),
  Google: require(imagePath + "Google" + png),
  Apple: require(imagePath + "Apple" + png),
  NotFound: require(imagePath + "NotFound" + png),
  Logo: require(imagePath + "Logo" + png),
};

export default Images;
