import React, { Component } from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import PropTypes from 'prop-types';
import { Navigation } from 'react-native-navigation';
import AnimatedComponent from 'ui/components/AnimatedComponent';
import { connect } from 'react-redux';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { getBackgroundColor } from 'ui/theme/general';
import { isIPhoneFailingSafeAreaView } from 'libs/device';

export default function withSafeAreaView(WrappedComponent) {
    class EnhancedComponent extends Component {
        static propTypes = {
            /** @ignore */
            theme: PropTypes.object.isRequired,
            /** @ignore */
            inactive: PropTypes.bool.isRequired,
            /** @ignore */
            isModalActive: PropTypes.bool.isRequired,
        };

        constructor(props) {
            super(props);
            this.state = {
                currentScreen: '',
            };
        }

        componentWillMount() {
            Navigation.events().registerComponentDidAppearListener((componentId) => {
                this.setState({ currentScreen: componentId.componentName });
            });
        }

        render() {
            const { theme, inactive, isModalActive } = this.props;
            const { currentScreen } = this.state;
            return (
                <SafeAreaView
                    style={{
                        flex: 1,
                        backgroundColor: inactive ? theme.body.bg : getBackgroundColor(currentScreen, theme, inactive),
                        paddingBottom: isModalActive ? 5 : 0,
                    }}
                >
                    <WrappedComponent {...this.props} />
                    {isIPhoneFailingSafeAreaView && (
                        <AnimatedComponent
                            animationInType={['fadeIn']}
                            animationOutType={['fadeOut']}
                            style={{
                                height: 34,
                                backgroundColor:
                                    inactive || isModalActive
                                        ? theme.body.bg
                                        : getBackgroundColor(currentScreen, theme, true, inactive),
                            }}
                        />
                    )}
                </SafeAreaView>
            );
        }
    }

    const mapStateToProps = (state) => ({
        theme: state.settings.theme,
        inactive: state.ui.inactive,
        isModalActive: state.ui.isModalActive,
    });

    return hoistNonReactStatics(connect(mapStateToProps)(EnhancedComponent), WrappedComponent);
}
