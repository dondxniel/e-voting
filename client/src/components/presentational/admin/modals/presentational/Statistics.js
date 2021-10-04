import React, { useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
import StatElement from './StatElement';

const Statistics = ({ stats }) => {

    useEffect(() => {
        // console.log("Whole props", props);
        console.log(stats);
        // console.log(typeof stats);
    }, [])

    return (
        <Container>
            <StatElement
                title="Total number of registered voters."
            >
                {/* 45000 */}
                {stats.totalRegVoters}
            </StatElement>
            <StatElement
                title="Total number of votes cast."
            >
                {/* 5000 */}
                {stats.totalVotesCast}
            </StatElement>
            <StatElement
                title="Percentage of voter turnout."
            >
                {/* 73.1% */}
                {stats.pVoterTurnout}
            </StatElement>
            <StatElement
                title="Number of votes cast by political party."
            >
                {stats.nVotesByParty.map(item => (
                    <Card className="py-1 my-1">
                        {item.party}: {item.num}
                    </Card>
                ))}
            </StatElement>
            <StatElement
                title="Percentage of votes cast by political party."
            >
                {stats.pVotesByParty.map(item => (
                    <Card className="py-1 my-1">
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
        </Container>
    )
}

Statistics.defaultProps = {
    stats: {
        totalRegVoters: 0, totalVotesCast: 0, pVoterTurnout: 0,
        nVotesByParty: [], pVotesByParty: [], pVotesByGender: { male: 0, female: 0 }
    }
}

export default Statistics
