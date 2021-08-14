import { Container, Row, Col } from 'react-bootstrap';
import LocalGovtElect from '../../presentational/admin/modals/LgElections/LgElectionsModal';
import StateElectionsModal from '../../presentational/admin/modals/StateElections/StateElectionsModal';
import FederalElectionsModal from '../../presentational/admin/modals/FederalElections/FederalElectionsModal';

const Home = () => {
    return (
        <Container className = "admin-homepage">
            <Row className = 'my-5'>
                <Col md = {3}>
                    {/* Select state */}
                </Col>
                <Col md = {3}>
                    {/* See local govt. election results */}
                    <LocalGovtElect />
                </Col>
                <Col md = {3}>
                    {/* See state govt. election results */}
                    <StateElectionsModal />
                </Col>
                <Col md = {3}>
                    {/* See federal govt. election results */}
                    <FederalElectionsModal />
                </Col>
            </Row>
        </Container>
    )
}

export default Home
