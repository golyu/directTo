// ==UserScript==
// @name        跳转链接直达
// @description 知乎,CSDN,简书,开源中国,掘金 跳转链接直达
// @namespace   https://github.com/golyu/directTo/issues
// @version     0.9.1
// @author      g
// @include     *://link.zhihu.com/*
// @include     *://link.csdn.net/*
// @include     *://link.juejin.cn/*
// @include     *://www.jianshu.com/go-wild*
// @include     *://www.oschina.net/action/GoToLink*
// @license     MIT License ???直接
// @supportURL  https://github.com/golyu/directTo/issues
// @run-at      document-start
// @grant       unsafeWindow
// ==/UserScript==
interface Website {
  getRegexp(): RegExp;

  getToUrl(href: string): string;
}

class Base implements Website {
  regexp: RegExp;
  regexpDetails: RegExp;

  constructor(regexp: RegExp, regexpDetails: RegExp) {
    this.regexp = regexp;
    this.regexpDetails = regexpDetails;
  }

  getRegexp(): RegExp {
    return this.regexp;
  }

  getToUrl(href: string): string {
    const result = this.regexpDetails.exec(href);
    if (result && result.length > 1) {
      return decodeURIComponent(result[1]);
    }
    return "";
  }
}

const websiteArray: Website[] = [
  new Base(/jianshu/, /.*jianshu.com\/go-wild.*url=(.*)/),
  new Base(/oschina/, /.*oschina.net\/action\/GoToLink.*url=(.*)/),
  new Base(/zhihu/, /.*link.zhihu.com\/\?target=(.*)/),
  new Base(/juejin/, /.*link.juejin.cn\/\?target=(.*)/),
  new Base(/csdn/, /.*link.csdn.net\/\?target=(.*)/),
];

websiteArray.some(website => {
  return (function (): boolean {
    if (website.getRegexp().test(window.location.href)) {
      const url = website.getToUrl(window.location.href);
      if (url) {
        window.location.href = url;
        return true;
      }
    }
    return false;
  })();
});
