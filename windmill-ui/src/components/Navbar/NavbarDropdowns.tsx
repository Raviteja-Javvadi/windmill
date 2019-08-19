import * as React from "react";
import styled from "styled-components";
import { Theme } from "../Theme";

const MenuItem = styled.div`
  font-size: ${Theme.fonts.subHeadingSize};
  padding: 3px 12px;
  &:hover {
    box-shadow: 30px 30px 30px rgba(0, 0, 0, 0.5) inset;
  }
  &:active {
    background: #5682d2;
  }
`;

const DropdownBox = styled.div`
  display: flex;
  flex: 1 0 auto;
  position: absolute;
  background: ${Theme.colors.light};
  flex-direction: column;
  border: 3px solid ${Theme.colors.lightAccent2};
  z-index: 10;
`;

const DropdownBoxItem = styled.div`
  justify-content: center;
  padding: 10px 30px;
  color: ${Theme.colors.dark};
  &:hover {
    background: ${Theme.colors.lightAccent};
  }
  min-width: 300px;
`;

const Sep = styled.hr`
  width: 80%;
  color: ${Theme.colors.dark};
  margin-left: auto;
  margin-right: auto;
`;

interface IDropdownItem {
  sep?: boolean;
  title?: string;
  callback?: Function;
}

class Dropdown extends React.Component<
  {
    title: string;
    items: IDropdownItem[];
  },
  { showDropdown: boolean }
> {
  node: React.RefObject<HTMLDivElement>;
  state = {
    showDropdown: false
  };
  constructor(props) {
    super(props);
    this.node = React.createRef();
  }

  public componentDidMount() {
    window.addEventListener("click", e => this.closeAfterUnrelatedClick(e));
  }

  public componentWillUnmount() {
    window.removeEventListener("click", e => this.closeAfterUnrelatedClick(e));
  }

  public closeDropdownBeforeCallback = (callback: Function) => {
    this.setState({ showDropdown: false });
    return callback();
  };

  public closeAfterUnrelatedClick = event => {
    if (this.node.current && !this.node.current.contains(event.target)) {
      this.setState({ showDropdown: false });
    }
  };

  public renderDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown });
  };

  public render() {
    const DropdownButtons: any = () =>
      this.props.items.map((item: IDropdownItem, index: Number) =>
        item.sep || false ? (
          <Sep key={`${this.props.title}-sep-${index}`} />
        ) : (
          <DropdownBoxItem
            onClick={() => this.closeDropdownBeforeCallback(item.callback)}
            key={`${this.props.title}-${item.title}-${index}`}
          >
            {item.title}
          </DropdownBoxItem>
        )
      );

    return (
      <div ref={this.node}>
        <MenuItem onClick={this.renderDropdown}>{this.props.title}</MenuItem>
        {this.state.showDropdown ? (
          <DropdownBox>
            <DropdownButtons />
          </DropdownBox>
        ) : null}
      </div>
    );
  }
}

interface IDropdown {
  getAppState: Function;
}

export class FileDropdown extends React.Component<IDropdown> {
  public handleNew() {
    alert("new is not implemented");
  }

  public handleOpen() {
    alert("open is not implemented");
  }

  public render() {
    return (
      <Dropdown
        title="File"
        items={[
          { title: "New", callback: this.handleNew },
          { title: "Open", callback: this.handleOpen },
          { sep: true },
          { title: "Sep!", callback: () => {} }
        ]}
      />
    );
  }
}

export class ViewDropdown extends React.Component<IDropdown> {
  public handleDagState(getAppState: Function) {
    console.log(getAppState());
  }

  public render() {
    return (
      <Dropdown
        title="View"
        items={[
          {
            title: "Log DagState",
            callback: () => this.handleDagState(this.props.getAppState)
          }
        ]}
      />
    );
  }
}

export class HelpDropdown extends React.Component<IDropdown> {
  public handleAbout(getAppState: Function) {
    console.log(getAppState());
  }

  public render() {
    return (
      <Dropdown
        title="Help"
        items={[
          {
            title: "About",
            callback: () => this.handleAbout(this.props.getAppState)
          }
        ]}
      />
    );
  }
}