import { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Container, Row, Card, Button } from 'react-bootstrap';
import { FaPrint } from 'react-icons/fa';
import StatElement from './StatElement';
import ResultSheet from './ResultSheet';
import toTitleCase from '../../../../../functions/toTitleCase';

const Statistics = ({ election, stats }) => {

    const [resultSheet, setResultSheet] = useState({
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
        declaration: ""
    })

    const [printable, setPrintable] = useState(false);

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });


    const ongoingOrPast = (passedDate) => {
        let date = new Date();
        let year = date.getFullYear();
        let month = (date.getMonth() + 1 < 10) ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
        let day = (date.getDate() < 10) ? `0${date.getDate()}` : `${date.getDate()}`;
        let today = `${year}-${month}-${day}`;
        today = new Date(today);
        passedDate = passedDate.split("-");
        passedDate = `${passedDate[2]}-${passedDate[1]}-${passedDate[0]}`;
        passedDate = new Date(passedDate);

        today = today.getTime();
        passedDate = passedDate.getTime();

        if (passedDate < today) {
            setPrintable(true);
        }

    }

    const setResultSheetData = () => {
        // 1. Election Category
        let electionCategory = election.electionType;
        if (electionCategory === "hor") {
            electionCategory = "House of Reps";
        } else if (electionCategory === "hoa") {
            electionCategory = "House of Assembly";
        } else {
            electionCategory = toTitleCase(electionCategory);
        }

        // 2. Location
        let type;
        switch (election.electionType) {
            case "chairmanship":
                type = "Local govt.";
                break;
            case "counselorship":
                type = "Ward";
                break;
            case "governorship":
                type = "State";
                break;
            case "hoa":
                type = "State Constituency";
                break;
            case "presidential":
                type = "State";
                break;
            case "senetorial":
                type = "Senatorial District";
                break;
            case "hor":
                type = "Federal Constituency";
                break;
            default:
                alert("Unidentifiable Election Type!!");
                type = "";
                break;
        }
        let location = { type, location: stats.location };

        // 3. State
        let state = election.admin.state;

        // 4. Total Registered Voters 
        let totalRegVoters = stats.totalRegVoters;

        // 5. Total Votes Cast 
        let totalVotesCast = stats.totalVotesCast;

        // 6. Election Date 
        let electionDate = election.electionDate;

        // 7. Election Type 
        let electionType = toTitleCase(election.admin.electionType);

        // 8. Contesting Parties 
        let contestingParties = election.contestingParties.map(item => {

            let nVotes = stats.nVotesByParty.filter(partyItem => {
                return (partyItem.party === item.party.abb)
            })
            nVotes = nVotes[0].num
            let pVotes = stats.pVotesByParty.filter(partyItem => {
                return (partyItem.party === item.party.abb)
            })
            pVotes = pVotes[0].percent;
            let returnObj = {
                party: item.party.fullname,
                abb: item.party.abb,
                nameOfContestant: item.candidate,
                nVotes,
                pVotes,
            }
            return returnObj
        })

        // 9. Declaration
        let declaration = ""

        // i. If no one votes
        // ii. If people vote, but there is a tie
        // iii. If people vote and there is a winner
        if (totalVotesCast <= 0) {
            declaration = "No one voted during this election.";
        } else {
            let winner = contestingParties[0];
            let counter = contestingParties.length - 1;
            while (counter >= 0) {
                if (contestingParties[counter].nVotes > winner.nVotes) winner = contestingParties[counter];
                --counter;
            }
            let winners = contestingParties.filter(item => item.nVotes === winner.nVotes);
            if (winners.length > 1) {
                declaration = "There was a tie so the election will redone. The election date will be announced at a later date.";
            } else if (winners.length < 1) {
                declaration = "The system experienced an error.";
            } else {
                declaration = `${winner.nameOfContestant} of ${winner.party}(${winner.abb}) haven satisfied the requirement of the law and polled the highest number of votes is hereby declared winner and returned elect.`;
            }
        }
        let tempResultSheet = {
            electionCategory, location, state, totalRegVoters, totalVotesCast, electionDate, electionType, contestingParties, declaration
        }

        setResultSheet(tempResultSheet);
    }

    useEffect(() => {
        setResultSheetData();
        ongoingOrPast(election.electionDate);
    }, [])

    return (
        <Container>
            {stats.totalRegVoters <= 0
                ?
                <div className="p-3 card m-3">
                    Nobody is registered under this location.
                </div>
                :
                <>
                    <StatElement
                        title="Total number of registered voters."
                    >
                        {stats.totalRegVoters}
                    </StatElement>

                    {stats.totalVotesCast <= 0 ?
                        <div className="p-3 card m-3">
                            No registered voter has voted.
                        </div>
                        :
                        <>
                            <StatElement
                                title="Total number of votes cast."
                            >
                                {stats.totalVotesCast}
                            </StatElement>
                            <StatElement
                                title="Percentage of voter turnout."
                            >
                                {stats.pVoterTurnout}%
                            </StatElement>
                            <StatElement
                                title="Number of votes cast by political party."
                            >
                                {stats.nVotesByParty.map(item => (
                                    <Card className="py-1 my-1" key={item.party}>
                                        {item.party}: {item.num}
                                    </Card>
                                ))}
                            </StatElement>
                            <StatElement
                                title="Percentage of votes cast by political party."
                            >
                                {stats.pVotesByParty.map(item => (
                                    <Card className="py-1 my-1" key={item.party}>
                                        {item.party}: {item.percent}%
                                    </Card>
                                ))}
                            </StatElement>
                            <StatElement
                                title="Percentage of votes cast by gender."
                            >
                                <Card className="py-1 my-1">
                                    Male: {stats.pVotesByGender.male}%
                                </Card>
                                <Card className="py-1 my-1">
                                    Female: {stats.pVotesByGender.female}%
                                </Card>
                            </StatElement>
                        </>
                    }

                    {printable && <Row className="justify-content-center text-center">
                        <div className="d-none">
                            <div ref={componentRef}>
                                <ResultSheet resultSheet={resultSheet} />
                            </div>
                        </div>
                        <Button
                            variant="success"
                            onClick={handlePrint}
                        >
                            <h3>
                                <FaPrint />
                            </h3>
                            Print
                        </Button>
                    </Row>
                    }
                </>

            }
        </Container>
    )
}

Statistics.defaultProps = {
    stats: {
        location: "",
        totalRegVoters: 0, totalVotesCast: 0, pVoterTurnout: 0,
        nVotesByParty: [], pVotesByParty: [], pVotesByGender: { male: 0, female: 0 }
    }
}

export default Statistics
