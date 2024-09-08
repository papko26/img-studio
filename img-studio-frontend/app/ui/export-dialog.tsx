import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import {
  Alert,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  RadioGroup,
  Slide,
  StepIconProps,
} from '@mui/material'
import { ImageI } from '@/app/api/imagen-generate/generate-utils'
import { TransitionProps } from '@mui/material/transitions'
import { CustomizedSendButton } from './components/Button-SX'
import { ArrowDownward, ArrowForwardIos, ArrowRight, Close, FileDownload, FileUpload, Send } from '@mui/icons-material'
import { CustomRadio } from './components/InputRadioButton'

import theme from 'app/theme'
import {
  ExportImageFormFields,
  ExportImageFormI,
  MetadataImproveFields,
  MetadataReviewFields,
} from '../api/imagen-generate/export-utils'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import FormInputChipGroupMultiple from './components/InputChipGroupMultiple'
import { useState } from 'react'
const palette = theme.palette

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function ExportStepper({
  open,
  control,
  setValue,
  onSubmit,
  formErrors,
  imageToExport,
  handleImageExportClose,
}: {
  open: boolean
  control: Control<ExportImageFormI, any>
  setValue: any
  onSubmit: any
  formErrors: FieldErrors<ExportImageFormI>
  imageToExport: ImageI
  handleImageExportClose: () => void
}) {
  // Stepper navigation
  const [activeStep, setActiveStep] = React.useState(0)
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)
  const [isEscapeClose, setIsEscapeClose] = useState(false)

  const onCloseTry: DialogProps['onClose'] = (
    event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
    reason
  ) => {
    if (reason && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
      event?.stopPropagation()
      setIsEscapeClose(true)
    } else {
      if (formErrors && Object.keys(formErrors).length > 0) {
        //handle error
      } else {
        onClose()
      }
    }
  }
  const onClose = () => {
    setIsEscapeClose(false)
    setActiveStep(0)
    handleImageExportClose()
  }
  const isSquareRatio = imageToExport ? imageToExport.ratio === '1:1' : true

  var infoToReview: { label: string; value: string }[] = []
  imageToExport &&
    MetadataReviewFields.forEach((field) => {
      const prop = ExportImageFormFields[field].prop ? ExportImageFormFields[field].prop : ''
      if (prop !== '')
        infoToReview.push({
          label: ExportImageFormFields[field].label,
          value: imageToExport[prop as keyof ImageI].toString(),
        })
    })

  function CustomStepIcon(props: StepIconProps) {
    const { active, completed, icon } = props

    return (
      <Typography
        variant="h3"
        component="span"
        sx={{
          color: active ? palette.primary.main : completed ? palette.text.secondary : palette.text.secondary,
          fontWeight: active ? 500 : 'normal',
          fontSize: active ? '1.5rem' : '1.2rem',
        }}
      >
        {icon}
      </Typography>
    )
  }

  function CustomStepLabel({ text, step }: { text: string; step: number }) {
    return (
      <Typography
        color={activeStep === step ? palette.primary.main : palette.secondary.main}
        sx={{ fontWeight: activeStep === step ? 500 : 400, fontSize: activeStep === step ? '1.3rem' : '1.1rem' }}
      >
        {text}
      </Typography>
    )
  }

  const ReviewStep = () => {
    return (
      <>
        <Box sx={{ pt: 1, pb: 2, width: '90%' }}>
          {infoToReview.map(({ label, value }) => (
            <Box display="flex" flexDirection="row">
              <ArrowRight sx={{ color: palette.primary.main, fontSize: '1.2rem', p: 0, mt: 0.2 }} />
              <Box sx={{ pb: 1 }}>
                <Typography display="inline" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>{`${label}: `}</Typography>
                <Typography
                  display="inline"
                  sx={{ fontSize: '0.9rem', color: palette.text.secondary }}
                >{`${value}`}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowForwardIos />}
            sx={{ ...CustomizedSendButton, ...{ fontSize: '0.85rem' } }}
          >
            {'Next'}
          </Button>
        </Box>
      </>
    )
  }

  const TagStep = () => {
    return (
      <>
        <Typography variant="subtitle1" color={palette.secondary.main} sx={{ pl: 1, width: '85%' }}>
          {'Improve metadata to make your image discoverable within the shared Library.'}
        </Typography>

        <Box sx={{ py: 2, width: '90%', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          {MetadataImproveFields.map((fieldObject) => {
            const param = Object.keys(fieldObject)[0] // Get the key (param) from the object
            const field = fieldObject[param]

            return (
              <Box key={param} py={1} pl={3} width="100%">
                <FormInputChipGroupMultiple
                  name={param}
                  label={field.label}
                  key={param}
                  control={control}
                  setValue={setValue}
                  width="400"
                  mandatory={false}
                  options={field.options}
                  required={field.isMandatory ? field.isMandatory : false}
                />
              </Box>
            )
          })}
        </Box>

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowForwardIos />}
            sx={{ ...CustomizedSendButton, ...{ fontSize: '0.8rem' } }}
          >
            {'Next'}
          </Button>
          <Button onClick={handleBack} sx={{ ...CustomizedSendButton, ...{ fontSize: '0.8rem' } }}>
            {'Back'}
          </Button>
        </Box>
      </>
    )
  }

  const UpscaleStep = () => {
    return (
      <>
        <Typography variant="subtitle1" color={palette.secondary.main} sx={{ pl: 1, width: '70%' }}>
          {'Upscale your 1:1 image resolution to make it look sharper and clearer.'}
        </Typography>
        <Controller
          name="upscaledFactor"
          control={control}
          render={({ field }) => (
            <RadioGroup {...field} sx={{ p: 2 }}>
              <CustomRadio
                label="No upscaling"
                subLabel={`${imageToExport.width} x ${imageToExport.height} px`}
                value=""
                currentSelectedValue={field.value}
                enabled={isSquareRatio}
              />
              <CustomRadio
                label="Scale x2"
                subLabel={isSquareRatio ? `2048 x 2048 px` : '/ only available for 1:1 ratio'}
                value="x2"
                currentSelectedValue={field.value}
                enabled={isSquareRatio}
              />
              <CustomRadio
                label="Scale x4"
                subLabel={isSquareRatio ? `4096 x 4096 px` : '/ only available for 1:1 ratio'}
                value="x4"
                currentSelectedValue={field.value}
                enabled={isSquareRatio}
              />
            </RadioGroup>
          )}
        />

        <Box sx={{ m: 0, pt: 2, display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            type="submit"
            onClick={onSubmit}
            variant="contained"
            // disabled={isLoading} #TODO
            // endIcon={isLoading ? <WatchLaterIcon /> : <SendIcon />}
            endIcon={<FileUpload sx={{ mr: 0.5 }} />}
            sx={CustomizedSendButton}
          >
            {'Export'}
          </Button>
          <Button onClick={handleBack} sx={{ ...CustomizedSendButton, ...{ fontSize: '0.8rem' } }}>
            {'Back'}
          </Button>
        </Box>
      </>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={onCloseTry}
      aria-describedby="parameter the export of an image"
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'left',
          p: 1,
          cursor: 'pointer',
          height: '90%',
          maxWidth: '70%',
          width: '40%',
          borderRadius: 1,
          background: 'white',
        },
      }}
    >
      <DialogContent sx={{ m: 1 }}>
        <DialogTitle sx={{ p: 0, pb: 3 }}>
          <Typography
            sx={{
              fontSize: '1.7rem',
              color: palette.text.primary,
              fontWeight: 400,
              display: 'flex',
              alignContent: 'center',
            }}
          >
            {'Export to internal Library'}
            <ArrowDownward sx={{ ml: 1, fontSize: 30, color: palette.primary.main }} />
          </Typography>
        </DialogTitle>

        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          sx={{
            backgroundColor: 'transparent',
            '& .MuiStepConnector-line': { minHeight: 0 },
          }}
        >
          <Step key="review">
            <StepLabel StepIconComponent={CustomStepIcon}>
              <CustomStepLabel text="Review metadata" step={0} />
            </StepLabel>
            <StepContent sx={{ px: 0, '&.MuiStepContent-root': { borderColor: 'transparent' } }}>
              <ReviewStep />
            </StepContent>
          </Step>

          <Step key="tag">
            <StepLabel StepIconComponent={CustomStepIcon}>
              <CustomStepLabel text="Improve discoverability" step={1} />
            </StepLabel>
            <StepContent sx={{ px: 0, '&.MuiStepContent-root': { borderColor: 'transparent' } }}>
              <TagStep />
            </StepContent>
          </Step>

          <Step key="upscale">
            <StepLabel StepIconComponent={CustomStepIcon}>
              <CustomStepLabel text="Upscale resolution" step={2} />
            </StepLabel>
            <StepContent sx={{ px: 0, '&.MuiStepContent-root': { borderColor: 'transparent' } }}>
              <UpscaleStep />
            </StepContent>
          </Step>
        </Stepper>
      </DialogContent>

      {isEscapeClose && (
        <Alert
          severity="warning"
          sx={{
            height: 'auto',
            mb: 2,
            fontSize: '1rem',
            fontWeight: 400,
            pt: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            color: palette.text.secondary,
          }}
          icon={false}
          variant="outlined"
        >
          {'Are you sure you want to exit now ?'}
          <Box sx={{ display: 'flex', alignContent: 'center' }}>
            <Button
              color="inherit"
              size="small"
              onClick={() => setIsEscapeClose(false)}
              sx={{ fontSize: '1rem', '&:hover': { background: 'transparent', color: palette.warning.dark } }}
            >
              <ArrowForwardIos sx={{ fontSize: '0.8rem', p: 0, mt: 0.2, mr: 0.5 }} />
              {'Keep editing'}
            </Button>
            <Button
              color="inherit"
              size="small"
              onClick={onClose}
              sx={{
                fontSize: '1rem',
                fontWeight: 400,
                fontStyle: 'italic',
                '&:hover': { background: 'transparent', color: palette.warning.dark },
              }}
            >
              <Close sx={{ fontSize: '0.8rem', p: 0, mt: 0.2, mr: 0.5 }} />
              {'Yes, close without exporting'}
            </Button>
          </Box>
        </Alert>
      )}
    </Dialog>
  )
}