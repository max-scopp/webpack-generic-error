/**




    ## ATTENTION ## ATTENTION ## ATTENTION ## ATTENTION ## ATTENTION ##

===============================================================================


This version is not yet fully compatible and is still under development.
The file exists purely for demonstrative purposes.



























 */

import React from "react";
import { Motion, spring } from "react-motion";
import FontAwesome from "react-fontawesome";

const activeClass = "is-active";
const notActiveClass = "not-active";

export class AuwContactBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      onServer: true
    };
  }

  componentDidMount() {
    this.setState({
      onServer: global.isServer
    });
  }

  handleFigureClick() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleClose() {
    this.setState({
      isOpen: false
    });
  }

  get contentRect() {
    return this.contentNode && this.contentNode.getClientRects().item(0);
  }
  get figureRect() {
    return this.figureNode && this.figureNode.getClientRects().item(0);
  }

  //#region other renderings

  renderCtaFigure() {
    return (
      <Motion
        style={{
          width: spring(
            this.state.isOpen
              ? this.figureNode
                ? this.figureNode.width
                : 0
              : 0
          )
        }}
      >
        {rect => (
          <span
            className={[
              "contact-box__figure",
              this.state.isOpen ? activeClass : ""
            ].join(" ")}
            ref={figureNode => (this.figureNode = figureNode)}
            onClick={this.handleFigureClick.bind(this)}
          >
            <FontAwesome name="phone" />
          </span>
        )}
      </Motion>
    );
  }

  renderCloseButton() {
    return (
      <span
        className="contact-box__button-close"
        onClick={this.handleClose.bind(this)}
      >
        <FontAwesome name="close" />
      </span>
    );
  }

  //#endregion

  render() {
    const contentRef = contentNode => (this.contentNode = contentNode);

    return (
      <Motion
        style={{
          width: spring(
            !this.state.isServer && this.state.isOpen
              ? 0
              : this.contentRect
                ? this.contentRect.width
                : 1000
          )
        }}
      >
        {rect => (
          <section
            className="contact-box"
            style={
              rect
                ? {
                    WebkitTransform: `translate3d(${
                      this.state.onServer ? "100%" : rect.width + "px"
                    }, 0, 0)`,
                    transform: `translate3d(${
                      this.state.onServer ? "100%" : rect.width + "px"
                    }, 0, 0)`
                  }
                : null
            }
          >
            {this.renderCtaFigure()}

            <div className="contact-box__body" ref={contentRef}>
              {this.renderCloseButton()}

              <h5 className="contact-box__title">{this.props.headline}</h5>

              <p dangerouslySetInnerHTML={{ __html: this.props.bodyHtml }} />

              <div
                className="contact-box__cta-form"
                dangerouslySetInnerHTML={{ __html: this.props.formHtml }}
              />
            </div>
          </section>
        )}
      </Motion>
    );
  }
}
