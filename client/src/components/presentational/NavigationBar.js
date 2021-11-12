import { Navbar, Col, Container, Row, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AdminNav from './AdminNav';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { set_logout } from '../../constants/actions';

const NavigationBar = ({ resultSheet }) => {
    const adminLoggedIn = useSelector(state => state.adminLoggedIn);
    const dispatch = useDispatch();
    const [cookies, setCookie, removeCookie] = useCookies(['adminToken', 'adminType', 'electionType', 'adminState']);

    const handleLogout = e => {
        e.preventDefault();
        removeCookie('adminToken', { path: '/' });
        removeCookie('adminType', { path: '/' });
        removeCookie('electionType', { path: '/' });
        removeCookie('adminState', { path: '/' });
        dispatch(set_logout());
    }

    return (
        <Navbar bg="light">
            <Container className="d-flex align-items-center flex-column">
                <Row>
                    <Navbar expand="lg" className="d-block">
                        <Container>
                            <Row>
                                <Col xs={3} >
                                    <Image fluid src="./images/kadsec_logo.png" />
                                </Col>
                                <Col xs={9} className="text-center py-5" >
                                    <h2>KADUNA STATE INDEPENDENT ELECTORAL COMMISION (KADSIEC)</h2>
                                </Col>
                            </Row>
                        </Container>
                    </Navbar>
                </Row>
                {!resultSheet &&
                    <>
                        <Row>
                            {!adminLoggedIn &&
                                <Col >
                                    <Link to="/register" className="btn btn-success">Become Registered Voter</Link>
                                </Col>}
                        </Row>
                        <Row>
                            {adminLoggedIn && <AdminNav adminType={cookies["adminType"]} handleLogout={handleLogout} />}
                        </Row>
                    </>}
            </Container>
        </Navbar>
    )
}

NavigationBar.defaultProps = {
    resultSheet: false
}

export default NavigationBar
