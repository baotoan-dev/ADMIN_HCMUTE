import { useState, React, useEffect } from 'react';
import './style.scss'
import { Box } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import { ExperienceDistribution } from 'components/Chart/Barchart/bar';
import { AreaChart, PieChart } from 'components';
import { axios } from 'configs';
import { years } from 'components/Chart/Barchart/year';
const Analytics = () => {
    const theme = useTheme();
    const [statisticData, setStatisticData] = useState();
    const [selectOption, setSelectOption] = useState('Post');
    const [selectPost, setSelectPost] = useState(false);
    const [selectAccount, setSelectAccount] = useState(false);
    const [selectCompany, setSelectCompany] = useState(false);
    const [selectYear, setSelectYear] = useState(new Date().getFullYear());

    const fetchDataApi = async (year) => {
        const res = await axios.get('/v1/home-admin/count'+ (year ? `?year=${year}` : ''),
            {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('access-token')
                }
            })
        if (res && res.success) {
            setStatisticData({
                postPerMonth: res.data.post_per_month,
                accountPerMonth: res.data.account_per_month,
                postPerStatus: res.data.post_per_status,
                companyPerMonth: res.data.company_per_month
            });
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            setSelectPost(true);
            fetchDataApi(0);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
           fetchDataApi(selectYear);
        }
        fetchData();
    }, [selectYear]);

    const handleOnChangeSelect = (e) => {
        setSelectOption(e.target.value);
        if (e.target.value === 'Post') {
            setSelectPost(true);
            setSelectAccount(false);
            setSelectCompany(false);
        }
        if (e.target.value === 'Account') {
            setSelectPost(false);
            setSelectAccount(true);
            setSelectCompany(false);
        }
        if (e.target.value === 'Company') {
            setSelectPost(false);
            setSelectAccount(false);
            setSelectCompany(true);
        }
    }

    return (
        <div className='container'>
            <h1 style={{
                color: 'white',
            }}>Statistics</h1>
            <Box>
                <Select
                    native
                    size='small'
                    value={selectOption}
                    sx={{
                        marginTop: '10px',
                    }}
                    onChange={(e) => {
                        handleOnChangeSelect(e);
                    }}
                    inputProps={{
                        name: 'age',
                        id: 'age-native-simple',
                    }}
                >
                    <option value="Post">Post</option>
                    <option value="Account">Account</option>
                    <option value="Company">Company</option>
                </Select>
            </Box>
            {statisticData && (
                <Box sx={{
                    width: '100%',
                }}>
                    {
                        selectPost && (
                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                width: '100%',
                                gap: '20px',
                            }}>

                                <Box
                                    sx={{ width: '100%' }}
                                >
                                    <Box
                                        sx={{
                                            color: theme.palette.color.main,
                                            fontSize: '1.5rem',
                                            fontWeight: 600,
                                            marginTop: '20px',
                                        }}
                                    >
                                        Post per status
                                    </Box>
                                    <PieChart data={statisticData.postPerStatus} />
                                </Box>
                                <Box
                                    sx={{ width: '100%' }}
                                >
                                    <Box
                                        sx={{
                                            color: theme.palette.color.main,
                                            fontSize: '1.5rem',
                                            fontWeight: 600,
                                        }}
                                    >
                                        Post per month
                                    </Box>
                                    <AreaChart data={statisticData.postPerMonth} />
                                </Box>
                            </Box>
                        )
                    }
                    {
                        selectAccount && (
                            <Box
                                sx={{
                                    width: '100%',
                                    marginTop: '20px',
                                }}
                            >
                                <Box
                                    sx={{
                                        color: theme.palette.color.main,
                                        fontSize: '1.5rem',
                                        fontWeight: 600,
                                    }}
                                >
                                    Account per month
                                </Box>
                                <AreaChart data={statisticData.accountPerMonth} />
                            </Box>
                        )
                    }

                    {
                        selectCompany && (
                            <Box
                                sx={{
                                    width: '100%',
                                    marginTop: '20px',
                                }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}>
                                    <Box
                                        sx={{
                                            color: theme.palette.color.main,
                                            fontSize: '1.5rem',
                                            fontWeight: 600,
                                        }}
                                    >
                                        Company per month
                                    </Box>

                                    
                                    <Box>
                                        <Select
                                            native
                                            size='small'
                                            value={selectYear}
                                            sx={{
                                                marginTop: '10px',
                                            }}
                                            onChange={(e) => {
                                                setSelectYear(e.target.value);
                                            }}
                                            inputProps={{
                                                name: 'age',
                                                id: 'age-native-simple',
                                            }}
                                        >
                                            {years.map((year) => (
                                                <option value={year.value}>{year.name}</option>
                                            ))}
                                        </Select>
                                    </Box>
                                </Box>
                                <ExperienceDistribution data={statisticData.companyPerMonth}/>
                            </Box>
                        )
                    }
                </Box>
            )}
        </div>
    );
}

export default Analytics;