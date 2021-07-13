/* eslint-disable react-hooks/rules-of-hooks */
import { useMediaQuery } from "@material-ui/core/useMediaQuery"

export const isMobileOrTablet = () => {
    const isMobileOrTablet = useMediaQuery(theme => theme.breakpoints.down('sm'));
    return { isMobileOrTablet };
}