import { Grid, Container, Snackbar } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';

import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useControllerActionContract, useControllerContract, useFarmContract, useHoldContract, useRouterContract } from '../../hooks/index';
import { formatEther, parseEther } from '@ethersproject/units';
import config from '../../utils/config.json';
import { Alert } from '@material-ui/lab';
import moment from 'moment';

function Dashboard() {
	const { account, library, active } = useWeb3React();
	const [snackBar, setSnackBar] = useState({
		status: false,
		type: '',
		message: '',
	});
	const [holdBalance, setHoldBalance] = useState(0.0);
	const [totalSupply, setTotalSupply] = useState(0.0);
	const [pendingExpansion, setPendingExpansion] = useState(0.0);
	const [lpLocked, setLpLocked] = useState(0.0);
	const [timeLock, setTimeLock] = useState(0);
	const [nextHarvest, setNextHarvest] = useState(0);
	const [prevHarvest, setPrevHarvest] = useState(0);

	const [wbnbBalance, setWbnbBalance] = useState(0.0);
	const [busdBalance, setBusdBalance] = useState(0.0);
	const [tvlBalance, setTvlBalance] = useState(0.0);

	const controllerContract = useControllerContract();
	const controllerActionContract = useControllerActionContract();
	const routerContract = useRouterContract();
	const holdContract = useHoldContract();
	const farmContract = useFarmContract();

	useEffect(() => {
		let stale = false;
		const initData = async () => {
			if (active) {
				const bal = await holdContract.balanceOf(account);
				const tBal = formatEther(bal);

				if (!stale) {
					setHoldBalance(tBal);
				}
			}

			try {
				const cakeBal = await farmContract.stakedWantTokens(7, config.CONTROLLER_CONTRACT_ADDRESS);
				const farmBal = formatEther(cakeBal);
				if (!stale) {
					setTvlBalance(farmBal);
				}
			} catch (e) {
				console.log(e);
			}

			try {
				const oldHarvest = await controllerContract.timeLock();
				const timeLockVal = await controllerContract.timeLocksecs();
				if (!stale) {
					setTimeLock(parseInt(timeLockVal));
				}
				const next = moment.unix(parseInt(oldHarvest) + 86400).fromNow();
				setNextHarvest(next);

				const prev = moment.unix(parseInt(oldHarvest)).fromNow();
				setPrevHarvest(prev);
			} catch (e) {
				console.log(e);
			}

			try {
				const bal = await holdContract.balanceOf(config.PAIR_ADDRESS);
				const lpBal = formatEther(bal);
				if (!stale) {
					setLpLocked(lpBal);
				}
			} catch (e) {
				console.log(e);
			}

			try {
				const totalTokenSupply = await holdContract.totalSupply();
				const totalTokenSupplyBal = formatEther(totalTokenSupply);
				if (!stale) {
					setTotalSupply(totalTokenSupplyBal);
				}
			} catch (e) {
				console.log(e);
			}

			try {
				const pendingExp = await holdContract.toMint();
				const pendingExpBal = formatEther(pendingExp);
				if (!stale) {
					setPendingExpansion(pendingExpBal);
				}
			} catch (e) {
				console.log(e);
			}

			try {
				const amountsOut = await routerContract.getAmountsOut(parseEther('1.0'), [config.HOLD_CONTRACT_ADDRESS, config.WBNB_ADDRESS, config.BUSD_ADDRESS]);

				const wbnbBal = formatEther(amountsOut[1]);
				if (!stale) {
					setWbnbBalance(wbnbBal);
				}

				const busdBal = formatEther(amountsOut[2]);
				if (!stale) {
					setBusdBalance(busdBal);
				}
			} catch (e) {
				console.log(e);
			}
		};

		initData();

		const updateData = setInterval(() => {
			initData();
		}, 5000);

		return () => {
			stale = true;
			clearInterval(updateData);
		};
	}, [account, active, controllerContract, holdContract, routerContract, farmContract]);

	const startHarvest = async () => {
		if (!active) return;
		try {
			const harvested = await controllerActionContract.harvest({
				gasPrice: 1000000,
				gasLimit: 1500000,
			});

			library.once(harvested.hash, (done) => {
				if (done.status === 1) {
					setSnackBar({
						status: true,
						type: 'success',
						message: `Harvest success.`,
					});
				} else {
					setSnackBar({
						status: true,
						type: 'error',
						message: `Harvest failed.`,
					});
				}
			});
		} catch (e) {
			console.log(e);
		}
	};

	const handleSnackBarClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setSnackBar({
			status: false,
			type: '',
			message: '',
		});
	};
	return (
		<Container>
			{!active && (
				<StyledWrapper>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<h4 className="title">What is HOLD.FARM ?</h4>
							<p class="desc">HOLD token generates passive income by allocating assets to other crypto farms, combining and picking best farming vaults. You just need to hold the HOLD TOKEN to get profits, cutting messy process of STAKING and doing complex operations.</p>
						</Grid>
					</Grid>
				</StyledWrapper>
			)}

			{active && (
				<StyledWrapper>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6} md={4}>
							<h4 className="title">Your Balance</h4>
							<p class="desc">
								<span className="value">{parseFloat(holdBalance).toFixed(2)}</span> <b className="token">HOLD</b>
							</p>
						</Grid>

						{timeLock > 86400 && (
							<Grid item xs={24} sm={6} md={4}>
								<Button className="styled-button" fullWidth variant="contained" color="primary" onClick={() => startHarvest()}>
									Harvest
								</Button>
							</Grid>
						)}
					</Grid>
				</StyledWrapper>
			)}

			<StyledWrapper>
				<Grid container spacing={6}>
					<Grid item xs={12} sm={6} md={4}>
						<h4 className="title">Token Price</h4>
						<p class="desc">
							<span className="value">1</span> <b className="token">HOLD</b> is exchangeable to <span className="value">{parseFloat(wbnbBalance).toFixed(4)}</span> <b className="token">BNB</b> or <span className="value">{parseFloat(busdBalance).toFixed(4)}</span> <b className="token">BUSD</b>
						</p>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<h4 className="title">Token Data</h4>
						<p class="desc">
							Token Supply is <span className="value">{parseFloat(totalSupply).toFixed(4)}</span> <b className="token">HOLD</b>, <span className="value">2.00%</span> token is burned on every transfer.
						</p>
					</Grid>
					<Grid item xs={12} sm={6} md={4}>
						<h4 className="title">Total Value Locked</h4>
						<p class="desc">
							TVL in liquidity pool is <span className="value">{parseFloat(2 * lpLocked * wbnbBalance).toFixed(4)}</span> <b className="token">BNB</b> and TVL in auto farm is <span className="value">{parseFloat(tvlBalance).toFixed(4)}</span> <b className="token">CAKE</b>.
						</p>
					</Grid>

					<Grid item xs={12} sm={6} md={4}>
						<h4 className="title">Buyback Timings</h4>
						<p class="desc">
							Last <b className="token">HOLD</b> token buyback was {prevHarvest} and the next buyback is {nextHarvest}{' '}
						</p>
					</Grid>

					<Grid item xs={12} sm={6} md={4}>
						<h4 className="title">Next Expansion</h4>
						<p class="desc">
							will increase supply by{' '}
							<span className="value">
								<span className="value">{parseFloat(pendingExpansion).toFixed(4)}</span>
							</span>{' '}
							<b className="token">HOLD</b> which is equal to{' '}
							<span className="value">
								<span className="value">{parseFloat(pendingExpansion * wbnbBalance).toFixed(4)}</span>
							</span>{' '}
							<b className="token">BNB</b> or{' '}
							<span className="value">
								<span className="value">{parseFloat(pendingExpansion * busdBalance).toFixed(4)}</span>
							</span>{' '}
							<b className="token">BUSD</b>
						</p>
					</Grid>

					<Grid item xs={12} sm={6} md={4}>
						<h4 className="title">Liquidity Pool </h4>
						<p class="desc">
							LP is currently worth <span className="value">{parseFloat(2 * lpLocked * wbnbBalance).toFixed(4)}</span> <b className="token">BNB</b> or <span className="value">{parseFloat(2 * busdBalance * lpLocked).toFixed(4)}</span> <b className="token">BUSD</b>
						</p>
					</Grid>
				</Grid>

				<div className="progress-wrapper">
					<div className="progress-info">
						<div>Last Harvest ({prevHarvest})</div>
						<div>Next Harvest ({nextHarvest})</div>
					</div>
					<LinearProgress variant="determinate" className="progress-bar" value={parseFloat((timeLock / 86400) * 100)} />
				</div>
			</StyledWrapper>

			<Snackbar open={snackBar.status} autoHideDuration={6000} onClose={handleSnackBarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
				<Alert variant="filled" onClose={handleSnackBarClose} severity={snackBar.type}>
					{snackBar.message}
				</Alert>
			</Snackbar>
		</Container>
	);
}

const StyledWrapper = styled.div`
	padding: 24px;
	margin: 24px 0;
	.input-field {
		margin-bottom: 24px;
	}
	.top-bar {
		position: relative;
		overflow: hidden;
		.info-button {
			position: absolute;
			top: 0;
			right: 0;
		}
	}

	.styled-button {
		margin: 8px 0;
	}

	.hold-button {
		margin-top: 24px;
	}

	.progress-info {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 16px 0;
	}

	.title {
		font-size: 24px;
		padding: 0;
		margin: 4px 0;
	}

	.desc {
		color: #555;
		font-size: 20px;
	}

	.progress-bar {
		height: 20px;
		border-radius: 5px;
	}

	.progress-wrapper {
		margin: 48px 0;
	}

	.value {
		color: #3742fa;
	}

	.token {
		color: #ff6348;
	}
`;

export default Dashboard;
