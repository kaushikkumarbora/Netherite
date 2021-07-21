import AppShell from '../shell/AppShell';
import Setup from '../../components/setup';
import React from 'react';
import NavBarTop from '../../components/dashboard/navbar';
import { sendCreds } from '../../store/actions';
import { connect } from 'react-redux';

class App extends React.Component {

    render() {
        return (
            <>
                <header className='sb-nav-fixed'>
                    <NavBarTop />
                </header>
                <section style={{ padding: '70px' }}>
                    {(() => {
                        if (this.props.setup) { return <AppShell /> }
                        else { return <Setup SetupCallback={this.props.sendCreds} /> }
                    })()}
                </section>
            </>
        );
    }
}


const mapStateToProps = state => {
    return {
        setup: state.dashboardState.setup
    };
};

const mapDispatchToProps = dispatch => ({
    sendCreds: (creds) => dispatch(sendCreds(creds))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);