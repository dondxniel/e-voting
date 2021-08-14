import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { FaAngleDown } from 'react-icons/fa';

const StatElement = ({ children, title }) => {
    return (
        <>
            <Accordion className = "my-2 text-center">
                <AccordionSummary expandIcon = {<FaAngleDown />}>{title}</AccordionSummary>
                <AccordionDetails>{children}</AccordionDetails>
            </Accordion>
        </>

    )
}

export default StatElement
