import React from "react";
import { objectToHtmlTags } from "auw-framework/dist/helpers";
import CookieManager from "js-cookie";

const activeClass = "is-active";
const notActiveClass = "not-active";
const oneDay = 8.64e7;
let instanceCounter = 0;

function capitalize(s) {
  return s && s[0].toUpperCase() + s.slice(1);
}

export class AuwCookieBanner extends React.Component {
  constructor(props) {
    super(props);

    instanceCounter++;

    if (instanceCounter > 1) {
      console.warn(
        "Attention! CookieBanner should only be initialized once, but there are " +
          instanceCounter +
          " instances present on current Page."
      );
    }

    this.bannerNode = 0;
    this.state = Object.assign(
      {
        isActive: !this.hasCookieBeenShown,
        bodyHtml: "We need them to store your session.",
        buttons: {
          agree: "Accept"
        },
        showSettings: {
          days: 1
        }
      },
      this.props
    );
  }

  componentDidMount() {
    if (this.hasCookieBeenShown) {
      console.info(
        "CookieBanner has been shown in the past, will show cookie information again on " +
          new Date(this.cookieState).toLocaleString()
      );
      return;
    }
    switch (this.state.type) {
      case "open":
        this.initVariantOpen();
        break;
      case "scroll":
        this.watchScroll = true;
        break;
      case "time":
        this.initVariantTime();
        break;
      default:
        console.error("Invalid `type` given to CookieBanner!", this.props.type);
        break;
    }
    this.updateDocumentPadding();
  }

  get hasCookieBeenShown() {
    if (global.isServer) {
      return true;
    }
    return (
      !!this.cookieState && new Date(this.cookieState).getTime() > Date.now()
    );
  }

  set cookieState(v) {
    let date = new Date(v);

    console.info(
      "CookieBanner will be shown again on " + date.toLocaleString()
    );

    CookieManager.set(`cookieBanner${this.props.cId || ""}`, v, {
      expires: false,
      path: "/"
    });

    return this.cookieState;
  }

  get cookieState() {
    const state = CookieManager.get(`cookieBanner${this.props.cId}`);

    if (state) {
      return parseInt(state, 10);
    }

    return state;
  }

  componentDidUpdate() {
    this.updateDocumentPadding();
  }

  componentDidMount() {
    if (!global.isServer) {
      if (this.watchScroll) {
        window.addEventListener("scroll", this.handleScroll.bind(this));
      }
    }
  }

  shouldComponentUpdate() {
    return this.state.isActive !== !this.hasCookieBeenShown;
  }

  componentWillMount() {
    this.setState({ isActive: !this.hasCookieBeenShown });
  }
  componentWillUnmount() {
    try {
      window.removeEventListener("scroll", this.handleScroll);
    } catch (e) {}
  }

  updateDocumentPadding() {
    if (!global.isServer) {
      if (this.state.isActive) {
        document.body.style.paddingTop =
          (this.bannerNode && `${this.bannerNode.clientHeight}px`) || "";
        console.log(
          "(CookieBanner) Set document padding-top to ",
          this.bannerNode.clientHeight
        );
      } else {
        document.body.style.paddingTop = "";
      }
    }
  }

  render() {
    return (
      <div
        className={`cookie-banner ${this.state.isActive ? activeClass : ""}`}
        ref={bannerNode =>
          (this.bannerNode = bannerNode) && this.updateDocumentPadding()
        }
      >
        <div className="container cookie-banner__container">
          <span className="cookie-banner__title">{this.state.title}</span>
          <div
            className="cookie-banner__body"
            dangerouslySetInnerHTML={{
              __html: objectToHtmlTags(this.state.bodyHtml)
            }}
          />
          <p>
            <button
              onClick={this.onAgree.bind(this)}
              type="button"
              className="btn btn-primary cookie-banner__btn-agree"
            >
              {this.state.buttons.agree}
            </button>
          </p>
        </div>
      </div>
    );
  }

  onAgree(ev) {
    if (this.props.cookiedays == 0) {
      this.setState({
        showSettings: {
          days: 365
        }
      });
    }
    this.cookieState = Date.now() + oneDay * this.state.showSettings.days;
    this.hide();
  }

  show() {
    this.setState({
      isActive: true
    });
  }

  hide() {
    this.setState({
      isActive: false
    });
  }

  handleScroll(ev) {
    let scrollTop = event.srcElement.body.scrollTop;
    if (scrollTop > this.state.showSettings.pixel) {
      this.show();
    }
  }

  /**
   * Initializer function for variant type "open"
   */
  initVariantOpen() {
    this.show();
  }

  /**
   * Initializer function for variant type "time"
   */
  initVariantTime() {
    if (
      !this.state.showSettings.time ||
      typeof this.state.showSettings.time !== "number"
    ) {
      console.error(
        "CookieBanner mode set to `time`, but given time is not valid!"
      );
      return;
    }

    console.info(
      `Showing CookieBanner in ${this.state.showSettings.time} second(s)`
    );
    setTimeout(() => this.show(), this.state.showSettings.time * 1e3);
  }
}
