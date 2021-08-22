import { Container, Row, Col } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import LocalGovtElect from '../../presentational/admin/modals/LgElections/LgElectionsModal';
import StateElectionsModal from '../../presentational/admin/modals/StateElections/StateElectionsModal';
import FederalElectionsModal from '../../presentational/admin/modals/FederalElections/FederalElectionsModal';

const Home = () => {

    const [cookies] = useCookies(["adminToken", "adminType", "electionType", "adminState"]);

    const fetchElectionStats = () => {

    }

    return (
        <Container className = "admin-homepage">
            <Row className='my-5 justify-content-center'>
                {
                    (cookies['adminType'] === "super") &&
                    <Col md={3}>
                    {/* Select state */}
                    </Col>
                }
                {
                    (cookies['adminType'] === "super" || cookies['electionType'] === "local") &&
                    <Col md={3}>
                    {/* See local govt. election results */}
                        <LocalGovtElect />
                    </Col>
                }
                {
                    (cookies['adminType'] === "super" || cookies['electionType'] === "state") &&
                    <Col md={3} >
                    {/* See state govt. election results */}
                        <StateElectionsModal />
                    </Col >
                }
                {
                    (cookies['adminType'] === "super" || cookies['electionType'] === "federal") &&
                    <Col md={3} >
                    {/* See federal govt. election results */}
                    <FederalElectionsModal />
                    </Col >
                }
            </Row>
        </Container>
    )
}

export default Home
