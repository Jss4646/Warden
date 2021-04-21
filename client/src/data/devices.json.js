const devices = {
  "iphone-5/se": {
    name: "iPhone 5/SE",
    width: 320,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E304 Safari/602.1",
    device: "mobile",
    touch: true,
    scale: 2,
    height: 568,
  },
  "iphone-6/7/8": {
    name: "iPhone 6/7/8",
    width: 375,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Mobile/15A372 Safari/604.1",
    device: "mobile",
    touch: true,
    scale: 2,
    height: 667,
  },
  "iphone-6/7/8-plus": {
    name: "iPhone 6/7/8 Plus",
    width: 414,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Mobile/15A372 Safari/604.1",
    device: "mobile",
    touch: true,
    scale: 3,
    height: 736,
  },
  "iphone-x/xs": {
    name: "iPhone X/XS",
    width: 375,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Mobile/15A372 Safari/604.1",
    device: "mobile",
    touch: true,
    scale: 3,
    height: 812,
  },
  "iphone-xr": {
    name: "iPhone XR",
    width: 414,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Mobile/15A372 Safari/604.1",
    device: "mobile",
    touch: true,
    scale: 2,
    height: 896,
  },
  "iphone-xs-max": {
    name: "iPhone XS Max",
    width: 414,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Mobile/15A372 Safari/604.1",
    device: "mobile",
    touch: true,
    scale: 3,
    height: 896,
  },
  "pixel-2": {
    name: "Pixel 2",
    width: 411,
    userAgent:
      "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36",
    device: "mobile",
    touch: true,
    scale: 2.625,
    height: 731,
  },
  "pixel-2-xl": {
    name: "Pixel 2 XL",
    width: 411,
    userAgent:
      "Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36",
    device: "mobile",
    touch: true,
    scale: 3.5,
    height: 823,
  },
  "galaxy-s9-s9+": {
    name: "Galaxy S9/S9+",
    width: 360,
    userAgent:
      "Mozilla/5.0 (Linux; Android 7.0; SM-G892A Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36",
    device: "mobile",
    touch: true,
    os: "Android",
    scale: 4,
    height: 740,
  },
  "galaxy-note-9": {
    name: "Galaxy Note 9",
    width: 414,
    height: 846,
    scale: 3.5,
    userAgent:
      "Mozilla/5.0 (Linux; Android 7.0; SM-G892A Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36",
    device: "mobile",
    touch: true,
    os: "Android",
  },
  "galaxy-note-3": {
    name: "Galaxy Note 3",
    width: 360,
    userAgent:
      "Mozilla/5.0 (Linux; U; Android 4.3; en-us; SM-N900T Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Mobile Safari/534.30",
    device: "mobile",
    touch: true,
    scale: 3,
    height: 640,
  },
  "galaxy-s5": {
    name: "Galaxy S5",
    width: 360,
    userAgent:
      "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36",
    device: "mobile",
    touch: true,
    scale: 3,
    height: 640,
  },
  "microsoft-lumia-550": {
    name: "Microsoft Lumia 550",
    width: 360,
    userAgent:
      "Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 550) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/14.14263",
    device: "mobile",
    touch: true,
    scale: 2,
    height: 640,
  },
  "nexus-5x": {
    name: "Nexus 5X",
    width: 412,
    userAgent:
      "Mozilla/5.0 (Linux; Android 8.0.0; Nexus 5X Build/OPR4.170623.006) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36",
    device: "mobile",
    touch: true,
    scale: 2.625,
    height: 732,
  },
  "nexus-6p": {
    name: "Nexus 6P",
    width: 412,
    userAgent:
      "Mozilla/5.0 (Linux; Android 8.0.0; Nexus 6P Build/OPP3.170518.006) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36",
    device: "mobile",
    touch: true,
    scale: 3.5,
    height: 732,
  },
  "nokia-8110-5g": {
    name: "Nokia 8110 4G",
    width: 240,
    height: 320,
    scale: 1,
    userAgent:
      "Mozilla/5.0 (Mobile; Nokia 8110 4G; rv:48.0) Gecko/48.0 Firefox/48.0 KAIOS/2.5",
    device: "mobile",
    touch: true,
    os: "KaiOS",
  },

  ipad: {
    name: "iPad",
    width: 768,
    userAgent:
      "Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Mobile/15A5341f Safari/604.1",
    device: "tablet",
    touch: true,
    scale: 2,
    height: 1024,
  },
  "ipad-mini": {
    name: "iPad Mini",
    width: 768,
    userAgent:
      "Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Mobile/15A5341f Safari/604.1",
    device: "tablet",
    touch: true,
    scale: 2,
    height: 1024,
  },
  "ipad-pro-10.5": {
    name: "iPad Pro (10.5-inch)",
    width: 834,
    height: 1112,
    scale: 2,
    userAgent:
      "Mozilla/5.0 (iPad; CPU OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari/604.1",
    device: "tablet",
    touch: true,
    os: "iOS",
  },
  "ipad-pro-12.9": {
    name: "iPad Pro (12.9-inch)",
    width: 1024,
    height: 1366,
    scale: 2,
    userAgent:
      "Mozilla/5.0 (iPad; CPU OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari/604.1",
    device: "tablet",
    touch: true,
    os: "iOS",
  },
  "kindle-fire-hdx": {
    name: "Kindle Fire HDX",
    width: 800,
    userAgent:
      "Mozilla/5.0 (Linux; U; en-us; KFAPWI Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Silk/3.13 Safari/535.19 Silk-Accelerated=true",
    device: "tablet",
    touch: true,
    scale: 2,
    height: 1280,
  },
  "nexus-10": {
    name: "Nexus 10",
    width: 800,
    userAgent:
      "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 10 Build/MOB31T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36",
    device: "tablet",
    touch: true,
    scale: 2,
    height: 1280,
  },
  "nexus-7": {
    name: "Nexus 7",
    width: 600,
    userAgent:
      "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 7 Build/MOB30X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36",
    device: "tablet",
    touch: true,
    scale: 2,
    height: 960,
  },

  "1080p": {
    name: "1080p Screen",
    width: 1920,
    height: 1080,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36",
    scale: 1,
    device: "desktop",
  },
  "1440p": {
    name: "1440p Screen",
    width: 2560,
    height: 1440,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36",
    scale: 1,
    device: "desktop",
  },
  "4k": {
    name: "4k Screen",
    width: 3840,
    height: 2160,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36",
    scale: 1,
    device: "desktop",
  },

  hidpi: {
    name: "Laptop with HiDPI screen",
    width: 1440,
    height: 900,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36",
    touch: false,
    scale: 2,
    device: "laptop",
  },
  mdpi: {
    name: "Laptop with MDPI screen",
    width: 1280,
    height: 800,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36",
    touch: false,
    scale: 1,
    device: "laptop",
  },
  touch: {
    name: "Laptop with touch",
    width: 1280,
    height: 950,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36",
    touch: true,
    scale: 1,
    device: "laptop",
  },
};

export default devices;
