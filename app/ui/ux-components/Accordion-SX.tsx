import { Height } from '@mui/icons-material'
import theme from '../../theme'
const { palette } = theme

export const CustomizedAccordion = {
  py: 0.5,
  bgcolor: 'transparent',
  boxShadow: 0,
  flexWrap: 'wrap',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    borderRadius: 1,
    border: 1,
    borderWidth: 1,
    borderColor: palette.secondary.light,
    minHeight: 0,
    margin: 0,
    '&:hover': {
      borderColor: palette.secondary.main,
    },
  },
}

export const CustomizedAccordionSummary = {
  backgroundColor: palette.background.paper,
  color: 'white',
  '&.Mui-expanded': {
    backgroundColor: 'white',
    color: palette.primary.main,
  },
}
