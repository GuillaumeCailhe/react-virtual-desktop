import React, { Component } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReact } from "@fortawesome/free-brands-svg-icons";
import {
  faWindowMinimize,
  faWindowMaximize,
  faWindowClose
} from "@fortawesome/free-solid-svg-icons";

const WindowWrapper = styled.div`
  position: absolute;

  background: #e6e6fa;

  border-radius: ${props => (props.maximized ? "0%" : "1%")};
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

  z-index: ${props => props.zIndex};
`;

const WindowHeader = styled.div`
  position: absolute;
  top: 0;

  width: 100%;
  height: 30px;

  line-height: 30px;
  text-align: center;
`;

const StyledWindowLogo = styled(WindowLogo)`
  display: inline-block;
  position: absolute;
  left: 10px;
  bottom: 0;
  top: 0;

  margin: auto;
  height: 25px;
`;

const HeaderTitle = styled.h2`
  display: inline-block;
  margin: auto;
  font-size: 0.8em;
`;

const WindowButtonGroup = styled.div`
  display: inline-block;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 6px;

  height: 100%;

  margin: auto;

  color: #686871;
  font-size: 0.8em;
`;

const StyledWindowButton = styled(WindowButton)`
  margin-left: 5px;

  &:hover {
    color: #141416;
  }
`;

const WindowBody = styled.div`
  background: #fafafe;

  position: absolute;
  top: 30px;
  bottom: 6px;
  left: 6px;
  right: 6px;

  overflow: auto;
`;

function WindowLogo(props) {
  return <FontAwesomeIcon className={props.className} icon={faReact} />;
}

function WindowButton(props) {
  return <FontAwesomeIcon className={props.className} icon={props.icon} />;
}

function ResizableWindow(props) {
  const resizableObject = (
    <ResizableBox
      className={
        props.resizable && !props.maximized ? "Resizable" : "Unresizable"
      }
      width={props.width}
      height={props.height}
      minConstraints={[200, 50]}
      axis={props.resizable ? "both" : "none"}
      handleSize={[0, 0]}
    >
      {props.children}
    </ResizableBox>
  );

  return resizableObject;
}

type WindowProps = {
  id: number,
  title?: string,
  active?: boolean,
  resizable?: boolean,
  defaultWidth?: number,
  defaultHeight?: number,
  maxWidth: number,
  maxHeight: number,
  zIndex?: number,
  minimizeFunction: func,
  closeFunction: func,
  focusFunction: func
};

class Window extends Component<WindowProps> {
  constructor(props) {
    super(props);

    this.state = {
      isMaximized: false,
      width: this.props.defaultWidth,
      height: this.props.defaultHeight,
      widthBeforeMaximized: this.props.defaultWidth,
      heightBeforeMaximized: this.props.defaultHeight
    };

    this.maximizeWindow = this.maximizeWindow.bind(this);
  }

  maximizeWindow() {
    let currentWidth = this.state.width;
    let currentHeight = this.state.height;

    if (!this.state.isMaximized) {
      this.setState({
        isMaximized: true,
        width: this.props.maxWidth,
        height: this.props.maxHeight,
        widthBeforeMaximized: currentWidth,
        heightBeforeMaximized: currentHeight
      });
    } else {
      this.setState({
        isMaximized: false,
        width: this.state.widthBeforeMaximized,
        height: this.state.heightBeforeMaximized
      });
    }
  }

  render() {
    const enlargeButton = (
      <a onClick={() => this.maximizeWindow()}>
        <StyledWindowButton icon={faWindowMaximize} />
      </a>
    );

    return (
      <Draggable
        bounds={{ top: 0 }}
        handle=".window-handle"
        axis={!this.state.isMaximized ? "both" : "none"}
        // not really the best way to center the div, we should use the parent element's width and not the window's
        // but defaultPosition cannot be changed after mounting.
        // would probably need to implement a custom Draggable with DraggrableCore for that purpose
        // or hack something with position and the onStop event
        defaultPosition={{
          x: window.innerWidth / 2 - this.state.width / 2,
          y: 0
        }}
        onMouseDown={() => this.props.focusFunction(this.props.id)}
      >
        <WindowWrapper
          maximized={this.state.isMaximized ? true : false}
          zIndex={this.props.zIndex}
        >
          <ResizableWindow
            width={this.state.width}
            height={this.state.height}
            resizable={this.props.resizable}
            maximized={this.state.isMaximized}
          >
            <WindowHeader className="window-handle">
              <StyledWindowLogo />
              <HeaderTitle>{this.props.title}</HeaderTitle>

              <WindowButtonGroup>
                <a onClick={() => this.props.minimizeFunction(this.props.id)}>
                  <StyledWindowButton
                    icon={faWindowMinimize}
                    onClick={() => alert("test")}
                  />
                </a>

                {this.props.resizable ? enlargeButton : null}

                <a onClick={() => this.props.closeFunction(this.props.id)}>
                  <StyledWindowButton icon={faWindowClose} />
                </a>
              </WindowButtonGroup>
            </WindowHeader>

            <WindowBody>{this.props.children}</WindowBody>
          </ResizableWindow>
        </WindowWrapper>
      </Draggable>
    );
  }
}

Window.defaultProps = {
  defaultWidth: 400,
  defaultHeight: 500,
  zIndex: 0
};

export default Window;
