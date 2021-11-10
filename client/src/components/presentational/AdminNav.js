import { Navbar, Container, Nav } from 'react-bootstrap';

const AdminNav = ({ adminType, handleLogout }) => {
    return (
        <Navbar bg="light" variant="light">
            <Container>
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/admin/home">Admin Home</Nav.Link>
                    {adminType === "sub" && <Nav.Link href="/admin/start-election">Start Election</Nav.Link>}
                    {adminType === "super" && <Nav.Link href="/admin/admins">Admins</Nav.Link>}
                    {adminType === "super" && <Nav.Link href="/admin/approved-parties">Approved Parties</Nav.Link>}
                    <Nav.Link href="/admin/history">History</Nav.Link>
                    <Nav.Link href="/" onClick={handleLogout}>Logout</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default AdminNav
