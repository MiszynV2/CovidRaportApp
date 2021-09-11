import classes from './TotalCountryStatistics.module.css'
import CovidApi, {totalCasesCovidAPI,totalDeathsCovidAPI,totalRecorveredCovidAPI} from '../../services/covid-api'
import {useCallback, useEffect, useState} from "react";
import {LOADING_STATE} from "../../constants";
import {Line} from "react-chartjs-2";


const TotalCountryStatistics=(props)=>{
    const [dataCases, setDataCases] = useState([]);
    const [dates,setDates] = useState()

    const [loadingStatus, setLoadingStatus] = useState(LOADING_STATE.idle);

    const TotalCasesCovidAPI = useCallback(async () => {

        setLoadingStatus(LOADING_STATE.pending);

        const response = await CovidApi.totalCasesCovidAPI(props.name)

        if (!response.isOK) {
            setLoadingStatus(LOADING_STATE.rejected);
        }

        setDataCases(response.data);
        setDates(response.data?.map((date)=>{
            return new Date(date?.Date).toLocaleDateString()
        }));

        setLoadingStatus(LOADING_STATE.resolved);
    }, [props.name]);

    //if(dataCases===undefined)return
    const mappedCases = (dataCases||[]).map((date)=>{
        return date?.Cases
    })

    useEffect(() => {
        TotalCasesCovidAPI();
    }, [TotalCasesCovidAPI]);



    if (loadingStatus === LOADING_STATE.idle || loadingStatus.pending) {
        return <div className={classes.main}>LOADING...</div>;
    }

    if (loadingStatus === LOADING_STATE.rejected) {
        return <div className={classes.main}>Error</div>;
    }
    if (!dataCases) {
        return (
            <div className={classes.main}>
                <h4>Something went wrong! Try search again (:</h4>
            </div>
        );
    }

    const state = {
        labels: dates,
        datasets: [
            {
                label: 'Cases',
                fill: true,
                lineTension: 0.5,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,0.3)',
                borderWidth: 2,
                data: mappedCases,
            }
        ],
    }
    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    };


    return(<div className={classes.main}>
            <h1 className={classes.title}>Total cases</h1>
            <Line className={classes.chart}  data={state}
                    options={options}/>
        </div>
        )
}
export default TotalCountryStatistics