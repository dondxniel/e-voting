import { Container, Card } from 'react-bootstrap';
import StatElement from './StatElement';

const Statistics = () => {
    return (
        <Container>
            <StatElement 
                title = "Total number of registered voters."
                >
                64000
            </StatElement>
            <StatElement 
                title = "Total number of votes cast."
            >
                50000
            </StatElement>
            <StatElement 
                title = "Percentage of voter turnout."
            >
                73.1%
            </StatElement>
            <StatElement 
                title = "Number of votes cast by political party."
                >
                <Card className = "py-1 my-1">
                    PDP: 25000
                </Card>
                <Card className = "py-1 my-1">
                    APC: 15000
                </Card>
                <Card className = "py-1 my-1">
                    PRP: 10000
                </Card>
            </StatElement>
            <StatElement 
                title = "Percentage of votes cast by political party."
                >
                <Card className = "py-1 my-1">
                    PDP: 40%
                </Card>
                <Card className = "py-1 my-1">
                    APC: 35%
                </Card>
                <Card className = "py-1 my-1">
                    PRP: 25%
                </Card>
            </StatElement>
            <StatElement 
                title = "Percentage of votes cast by gender."
                >
                <Card className = "py-1 my-1">
                    Male: 40%
                </Card>
                <Card className = "py-1 my-1">
                    Female: 35%
                </Card>
            </StatElement>
        </Container>
    )
}

export default Statistics
