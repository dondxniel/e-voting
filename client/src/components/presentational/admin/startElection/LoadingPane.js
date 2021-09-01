import { Container, Row, Button } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Loading from '../../Loading';

const LoadingPane = ({saving, message, startingPane}) => {
    return (
        <Container>
            {
                (saving)?
                    <Row className = "text-center">
                        <Loading variant = "lg"/>
                    </Row>
                :
                <>
                {
                    (message) &&
                    <>
                    {(message.variant === 'success')?
                        <Row className = "text-center p-5">
                            <Button onClick = {startingPane} variant = "default"><h1 className = "text-success display-1"><FaCheckCircle /></h1></Button>
                        </Row>
                        :
                        <>
                            {(message.variant === 'failure') &&
                                <Row className = "text-center p-5">
                                    <Button onClick = {startingPane} variant = "default"><h1 className = "text-danger display-1"><FaTimesCircle /></h1></Button>
                                </Row>

                            }
                        </>
                    }
                    </>
                }
                </>
            }
        </Container>
    )
}

export default LoadingPane
