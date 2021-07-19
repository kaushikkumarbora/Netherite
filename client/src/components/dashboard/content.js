import { Alert, Form, Button } from "react-bootstrap"
import './advsearch.css'

function Brief() {
    return (
        <Alert variant="success">
            <Alert.Heading>Assets</Alert.Heading>
            <p>
                Aww yeah, you successfully read this important alert message. This example
                text is going to run a bit longer so that you can see how spacing within an
                alert works with this kind of content.
            </p>
            <hr />
            <p className="mb-0">
                Whenever you need to, be sure to use margin utilities to keep things nice
                and tidy.
            </p>
        </Alert>
    )
}

function Clear() {
    var to_clear = document.getElementsByClassName('to-clear-custom');
    for (var i = 0; i < 8; i++) {
        to_clear[i].value = '';
    }
}

function SearchControls({ RefreshCallback, InputCallback, AdvSearch }) {

    const Search = () => {
        var hostname = document.getElementById('hname').value;
        var ip = document.getElementById('ip').value;
        var mac = document.getElementById('mac').value;
        var os = document.getElementById('os').value;
        var build = document.getElementById('build').value;
        var domain = document.getElementById('domain').value;
        var workgroup = document.getElementById('workgroup').value;
        var status = document.getElementById('status').value;
        AdvSearch({
            hostname: hostname,
            ip: ip,
            mac: mac,
            os: os,
            build: build,
            domain: domain,
            workgroup: workgroup,
            status: status
        })
    }

    return (
        <>
            <Form>
                <Form.Control type="text" placeholder="Search..." onChange={InputCallback} />
                <Form.Text className="text-muted">
                    Search for assets.
                </Form.Text>
                <div id="AdvSearch" className="collapse container-advsearch">
                    <Form.Control type="text" className="hostname to-clear-custom" id="hname" placeholder="Hostname" />
                    <Form.Control type="text" className="ip to-clear-custom" id="ip" placeholder="IP" />
                    <Form.Control type="text" className="mac to-clear-custom" id="mac" placeholder="MAC" />
                    <Form.Control type="text" className="os to-clear-custom" id="os" placeholder="OS" />
                    <Form.Control type="text" className="build to-clear-custom" id="build" placeholder="Build" />
                    <Form.Control type="text" className="domain to-clear-custom" id="domain" placeholder="Domain" />
                    <Form.Control type="text" className="workgroup to-clear-custom" id="workgroup" placeholder="Workgroup" />
                    <Form.Control type="text" className="status to-clear-custom" id="status" placeholder="Status" />
                    <div className="buttons">
                        <div className="searchbutton">
                            <Button onClick={Search}>
                                Search
                            </Button>
                        </div>
                        <div className="clearbutton">
                            <Button onClick={Clear} variant="danger">
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>
            </Form>
            <div className="d-flex justify-content-end">
                <div style={{ paddingRight: '5px' }}>
                    <Button>
                        <div href="#AdvSearch" data-bs-toggle="collapse">Advanced Search</div>
                    </Button>
                </div>
                <Button variant='success' onClick={RefreshCallback}>
                    Refresh
                </Button>
            </div>

        </>
    )
}

export {
    Brief,
    SearchControls
}