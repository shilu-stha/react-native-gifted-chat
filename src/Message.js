/* eslint react-native/no-inline-styles: 0 */

import PropTypes from 'prop-types';
import React from 'react';
import { View, ViewPropTypes, StyleSheet } from 'react-native';

import Avatar from './Avatar';
import Bubble from './Bubble';
import SystemMessage from './SystemMessage';
import Day from './Day';

import { isSameUser, isSameDay } from './utils';

const styles = {
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    bubbleContainer: {
      marginLeft: 8
    },
    actionContainer:{
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    }
  }),
  right: StyleSheet.create({
    container: {
      flexDirection: 'row-reverse',
      alignItems: 'center'
    },
    bubbleContainer: {
      marginRight: 8
    },
    actionContainer:{
      alignItems: 'flex-end',
      justifyContent: 'space-between'
    }
  })
};

export default class Message extends React.Component {

  shouldComponentUpdate(nextProps) {
    const next = nextProps.currentMessage;
    const current = this.props.currentMessage;
    const { nextMessage } = this.props;
    const nextPropsMessage = nextProps.nextMessage;
    return (
      next.sent !== current.sent ||
      next.received !== current.received ||
      next.pending !== current.pending ||
      next.createdAt !== current.createdAt ||
      next.text !== current.text ||
      next.image !== current.image ||
      next.video !== current.video ||
      next.audio !== current.audio ||
      nextMessage !== nextPropsMessage
    );
  }

  getInnerComponentProps = () => {
    const { containerStyle, ...props } = this.props;
    return {
      ...props,
      isSameUser,
      isSameDay,
    };
  };

  renderDay() {
    if (this.props.currentMessage.createdAt) {
      const dayProps = this.getInnerComponentProps();
      if (this.props.renderDay) {
        return this.props.renderDay(dayProps);
      }
      return <Day {...dayProps} />;
    }
    return null;
  }

  renderBubble() {
    const bubbleProps = this.getInnerComponentProps();
    if (this.props.renderBubble) {
      return this.props.renderBubble(bubbleProps);
    }
    return <Bubble {...bubbleProps} />;
  }

  renderSystemMessage() {
    const systemMessageProps = this.getInnerComponentProps();
    if (this.props.renderSystemMessage) {
      return this.props.renderSystemMessage(systemMessageProps);
    }
    return <SystemMessage {...systemMessageProps} />;
  }

  renderAvatar() {
    if (this.props.user._id === this.props.currentMessage.user._id && !this.props.showUserAvatar) {
      return null;
    }
    const avatarProps = this.getInnerComponentProps();
    const { currentMessage } = avatarProps;
    if (currentMessage.user.avatar === null) {
      return null;
    }
    return <Avatar {...avatarProps} />;
  }

  renderMessageAction() {
    const messageActionViewProps = this.getInnerComponentProps();
    if (this.props.renderMessageAction) {
      return this.props.renderMessageAction(messageActionViewProps);
    }
    return null
  }

  render() {
    const sameUser = isSameUser(this.props.currentMessage, this.props.nextMessage);
    return (
      <View>
        {this.renderDay()}
        {this.props.currentMessage.system ? (
          this.renderSystemMessage()
        ) : (
          <View
              style={[
                styles[this.props.position].container,
                { marginBottom: sameUser ? 2 : 10 },
                !this.props.inverted && { marginBottom: 2 },
                this.props.containerStyle[this.props.position]
              ]}
            >
              {this.renderAvatar()}
              <View style ={[styles[this.props.position].bubbleContainer]}>
                {this.renderBubble()}
              </View>
              <View style={[styles[this.props.position].actionContainer]}>
                {this.renderMessageAction()}
              </View>
          {/* <View style ={styles.mainContainer}>
            {this.props.position === 'right' ? 
              (<View style={[styles.leftActionContainer]}>
                {this.renderMessageAction()}
              </View>) : null}
            
            <View
              style={[
                styles[this.props.position].container,
                { flex:1, marginBottom: sameUser ? 2 : 10 },
                !this.props.inverted && { marginBottom: 2 },
                this.props.containerStyle[this.props.position]
              ]}
            >
                {this.props.position === 'left' ? this.renderAvatar() : null}
                {this.renderBubble()}
                {this.props.position === 'right' ? this.renderAvatar() : null}
            </View>
            {this.props.position === 'left' ? 
              (<View style={[styles.rightActionContainer]}>
                {this.renderMessageAction()}
              </View>) : null }
          </View> */}

          </View>
        )}
      </View>
    );
  }

}

Message.defaultProps = {
  renderAvatar: undefined,
  renderBubble: null,
  renderDay: null,
  renderSystemMessage: null,
  renderMessageAction: null,
  position: 'left',
  currentMessage: {},
  nextMessage: {},
  previousMessage: {},
  user: {},
  containerStyle: {},
  showUserAvatar: true,
  inverted: true,
};

Message.propTypes = {
  renderAvatar: PropTypes.func,
  showUserAvatar: PropTypes.bool,
  renderBubble: PropTypes.func,
  renderDay: PropTypes.func,
  renderSystemMessage: PropTypes.func,
  renderMessageAction: PropTypes.func,
  position: PropTypes.oneOf(['left', 'right']),
  currentMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  user: PropTypes.object,
  inverted: PropTypes.bool,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
};
