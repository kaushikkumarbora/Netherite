import React from 'react';
import { connect } from 'react-redux';
import { Jumbotron, Table } from 'react-bootstrap';
import { fetchAssets, filteredAssets, assetsUpdated } from '../../store/actions'
import Search from '../../components/dashboard/search';
import NavBarTop from '../../components/dashboard/navbar';
import { Brief, SearchControls } from '../../components/dashboard/content';
import { reformat } from '../../store/actions';

const client = new WebSocket('ws://localhost:4001');

class AppShell extends React.Component {

    componentDidMount() {
        this.props.fetchAssets();

        client.addEventListener('open', (event) => {
            console.log('Websocket Connected');
        });

        client.addEventListener('message', (event) => {
            var data = JSON.parse(event.data);
            this.props.assetsUpdated(reformat(data))
        });
    }

    search(condition) {
        if (condition.summ) {
            return this.props.assets.filter(asset => asset.summ.toLowerCase().includes(condition.summ.toLowerCase()));
        }
        else {
            return this.props.assets.filter(asset => {
                for (var key in condition) {
                    if (condition[key] !== undefined && condition[key] !== '') {
                        if (asset[key] === undefined || asset[key] === null || !asset[key].toLowerCase().includes(condition[key].toLowerCase()))
                            return false;
                    }
                }
                return true;
            })
        }
    }

    onInputChange = (event) => {
        window.scrollTo(0, 0);
        if (event.target.value.length !== 0) {
            var filtered = this.search({ summ: event.target.value })
            this.props.filteredAssets(filtered);
        }
        else {
            this.props.filteredAssets(this.props.assets);
        }
    }

    advSearch = (condition) => {
        window.scrollTo(0, 0);
        var filtered = this.search(condition)
        this.props.filteredAssets(filtered);
    }

    Refresh = () => {
        this.props.fetchAssets()
    }

    render() {
        return (
            <>
                <header className='sb-nav-fixed'>
                    <NavBarTop />
                </header>
                <section style={{ padding: '70px' }}>
                    <Brief />
                    <SearchControls RefreshCallback={this.Refresh} InputCallback={this.onInputChange} AdvSearch={this.advSearch} />
                    <Jumbotron fluid>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Asset_id</th>
                                    <th>Hostname</th>
                                    <th>IP</th>
                                    <th>MAC</th>
                                    <th>OS</th>
                                    <th>Build</th>
                                    <th>Workgroup</th>
                                    <th>Domain</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <Search Assets={this.props.subset} />
                            </tbody>
                        </Table>
                    </Jumbotron>
                </section>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        assets: state.dashboardState.assets,
        subset: state.dashboardState.subset
    };
};

const mapDispatchToProps = dispatch => ({
    fetchAssets: () => dispatch(fetchAssets()),
    filteredAssets: (subset) => dispatch(filteredAssets(subset)),
    assetsUpdated: (assets) => dispatch(assetsUpdated(assets))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppShell);
