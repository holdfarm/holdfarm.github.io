import { Grid } from '@material-ui/core';
import styled from 'styled-components';
function HeaderBar() {
	return (
		<StyledFooter>
			<Grid container direction="row" justify="center" alignItems="center">
				<div className="footer-links">
					<a target="_blank" rel="noreferrer" href="https://twitter.com/HoldFarm">
						Twitter
					</a>

					<a target="_blank" rel="noreferrer" href="https://t.me/HoldfarmTG">
						Telegram
					</a>

					<a target="_blank" rel="noreferrer" href="https://holdfarm.medium.com">
						Medium
					</a>

					<a target="_blank" rel="noreferrer" href="https://github.com/holdfarm">
						Github
					</a>

					<a target="_blank" rel="noreferrer" href="https://docs.hold.farm">
						Documentation
					</a>

					<a target="_blank" rel="noreferrer" href="https://bscscan.com/address/0x593bdbaf7e65c51f5a35761cc688245a560e6a02">
						Smart Contract
					</a>
				</div>
			</Grid>
		</StyledFooter>
	);
}

const StyledFooter = styled.div`
	height: 50px;
	padding: 24px 8px;
	font-weight: 500;

	.footer-links {
		a {
			padding: 0 8px;
		}
	}
`;

export default HeaderBar;
