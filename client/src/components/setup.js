import { Alert, Form, Button, Jumbotron } from "react-bootstrap"
import './setup.css'

function Clear() {
    var to_clear = document.getElementsByClassName('to-clear-custom');
    for (var i = 0; i < 4; i++) {
        to_clear[i].value = '';
    }
}

function Setup({ SetupCallback }) {

    const Setup = () => {
        var username = document.getElementById('user').value;
        var server = document.getElementById('server').value;
        var password = document.getElementById('password').value;
        var target = document.getElementById('target').value.split(',');
        SetupCallback({
            username: username,
            server: server,
            password: password,
            target: target
        })
    }

    return (
        <>
            <Alert variant="success">
                <Alert.Heading>Setup</Alert.Heading>
                <p>
                    Enter SSH Credentials and Network info.
                </p>
            </Alert>
            <Jumbotron fluid>
                <Form>
                    <div id="Setup" className="container-setup">
                        <Form.Text className="pl_user">Username: </Form.Text><Form.Control type="text" className="user to-clear-custom" id="user" placeholder="Username" />
                        <Form.Text className="pl_server">Server: </Form.Text><Form.Control type="text" className="server to-clear-custom" id="server" placeholder="SSH Server" />
                        <Form.Text className="pl_password">Password: </Form.Text><Form.Control type="password" className="password to-clear-custom" id="password" placeholder="Password" />
                        <Form.Text className="pl_target">Target: </Form.Text><Form.Control type="text" className="target to-clear-custom" id="target" placeholder="Target subnet/host" />
                        <div className="buttons">
                            <div className="setupbutton">
                                <Button onClick={Setup}>
                                    Setup
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
            </Jumbotron>
        </>
    )
}

export default Setup;