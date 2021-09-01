import { useState } from 'react';
import axios from 'axios';
import LgGovt from '../../presentational/admin/startElection/lgGovt/LgGovt';
import StateGovt from '../../presentational/admin/startElection/stateGovt/StateGovt';
import FederalGovt from '../../presentational/admin/startElection/federalGovt/FederalGovt';
import { useCookies } from 'react-cookie';
import { START_ELECTION_ROUTE } from '../../../constants/endpoints'


const StartElection = () => {

    const [ cookies ] = useCookies(["adminToken", "adminType", "electionType", "adminState"])
    
    const [ admin ] = useState({
        state: `${cookies["adminState"]}`,
        adminType: `${cookies["adminType"]}`,
        electionType: `${cookies["electionType"]}`
    })

    const startElection = (data) => {

        data = { admin, ...data };
        
        return axios({
            method: 'POST',
            url: START_ELECTION_ROUTE,
            headers: {
                "content-type": "application/json",
                'Authorization' : `${cookies['adminToken']}`
            },
            data: data
        })
        .then(({data}) => {
            return data;
        })
        .catch(err => {
            return {
                success: false,
                data: err,
                message: "There was an error in starting the election."
            }
        })
    }
    
    switch(cookies["electionType"]){
        case "local":
            return (
                <div>
                    <LgGovt startElection = {startElection} />
                </div>
            )
        case "state":
            return (
                <div>
                    <StateGovt state = {cookies["adminState"]} startElection = {startElection} />
                </div>
            )
        case "federal":
            return (
                <div>
                    <FederalGovt state = {cookies["adminState"]} startElection = {startElection} />
                </div>
            )
        case "none":
            return (
                <div>
                    <div className="alert alert-danger text-center">Super Admins are not allowed to start Elections</div>
                </div>
            )
        default:
            return (
                <div>
                    <div className="alert alert-danger text-center">Unknown Election Type</div>
                </div>
            )
    }
    
}

export default StartElection
