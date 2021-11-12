import NavigationBar from '../../../NavigationBar';
import {
    Container, Row, Col, Table
} from 'react-bootstrap';
import toTitleCase from '../../../../../functions/toTitleCase';

const ResultSheet = ({ resultSheet }) => {
    /*
    {
        electionCategory: "",
        location: {
            type: "",
            location: ""
        },
        state: "",
        totalRegisteredVoters: 0,
        totalVotesCast: 0,
        electionDate: "",
        electionType: "",
        contestingParties: [],
        winnerContestingParty: {
            party: "",
            partyAbb: "",
            nameOfContestant: "",
            nVotes: 0,
            pVotes: 0
        }
    }
    */
    return (
        <Container>
            <div className="text-center">
                <NavigationBar resultSheet={true} />
                <b><h1>Election Result Sheet</h1></b>
                <div className="result-details border border-dark">
                    <Container>
                        <Row className="text-start">
                            <Col>
                                <div className="result-details-left">
                                    <div>
                                        <span>Election Category: </span>
                                        <b>{resultSheet.electionCategory}</b>
                                    </div>
                                    <div>
                                        <span>{resultSheet.location.type}: </span>
                                        <b>{resultSheet.location.location}</b>
                                    </div>
                                    <div>
                                        <span>State: </span>
                                        <b>{resultSheet.state}</b>
                                    </div>
                                </div>
                            </Col>
                            <Col>
                                <div className="border-start border-dark px-1">
                                    <div>
                                        <span>Total Registered Voters: </span>
                                        <b>{resultSheet.totalRegVoters}</b>
                                    </div>
                                    <div>
                                        <span>Total Votes Cast: </span>
                                        <b>{resultSheet.totalVotesCast}</b>
                                    </div>
                                    <div>
                                        <span>Election Date: </span>
                                        <b>{resultSheet.electionDate}</b>
                                    </div>
                                    <div>
                                        <span>Election Type: </span>
                                        <b>{resultSheet.electionType}</b>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div className="mt-4 border border-dark">
                    <Table bordered className="border-dark">
                        <thead>
                            <tr>
                                <th>S/N</th>
                                <th>POLITICAL PARTY</th>
                                <th>CONTESTANT NAME</th>
                                <th>NUMBER OF VOTES</th>
                                <th>PERCENTAGE OF VOTES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultSheet.contestingParties.map((item, index) =>
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{item.abb}</td>
                                    <td>{item.nameOfContestant}</td>
                                    <td>{item.nVotes}</td>
                                    <td>{item.pVotes}%</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <p className="text-start p-3">
                        <b>DECLARATION: </b> {resultSheet.declaration}
                    </p>
                </div>
                <Container className="text-start my-5 border border-dark">
                    <Row className="my-3" >
                        <Col>
                            <b>Name of Returning Officer: </b>
                            <span>................................................</span>
                        </Col>
                    </Row>
                    <Row className="my-3" >
                        <Col>
                            <b>Designation: </b>
                            <span>................................................</span>
                        </Col>
                        <Col>
                            <b>Signature & Date: </b>
                            <span>................................................</span>
                        </Col>
                    </Row>
                </Container>
                <Container className="text-start my-5 border border-dark">
                    <ol>
                        {resultSheet.contestingParties.map((item, index) =>
                            <li className="my-3" key={index}>
                                <Row>
                                    <Col>
                                        <b>Name of Party Agent: </b>
                                        <span>................................................</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <b>Acronym of Party: </b>
                                        <span>{item.abb} </span>
                                    </Col>
                                    <Col>
                                        <b>Signature & Date: </b>
                                        <span>................................................</span>
                                    </Col>
                                </Row>
                            </li>
                        )}
                    </ol>
                </Container>
            </div>
        </Container >
    )
}

export default ResultSheet;