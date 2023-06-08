import { useForm, SubmitHandler, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { createTheme } from "@mui/material/styles";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import PostAddIcon from "@mui/icons-material/PostAdd";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Container, IconButton, MenuItem, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { UserData } from "../../../../api/ApiAccount";
import { VaccinationInformation } from "../../../../api/ApiVaccination";
import { format } from "date-fns";
import {
  EventInformation,
  finishEventTerm,
  takeEventTerm,
} from "../../../../api/ApiEvent";

interface EventAddEditFormProps {
  onClose: () => void;
  eventInformation?: EventInformation | undefined;
  doctorsList: UserData[];
  patientsList: UserData[] | undefined;
  vaccinationsList: VaccinationInformation[];
  newEventStartTime?: string;
  newEventDoctor?: UserData;
  isPatient: Boolean;
}

const addEventSchema = yup.object().shape({
  vacId: yup.number().required(),
  doctorId: yup.number().required(),
  timeFrom: yup.string().required(),
  dateFrom: yup.date().required(),
});

const EventAddEditForm: React.FC<EventAddEditFormProps> = ({
  onClose,
  eventInformation,
  doctorsList,
  patientsList,
  vaccinationsList,
  newEventStartTime,
  newEventDoctor,
  isPatient,
}) => {
  const isEdit = !!eventInformation;

  const [availableDays, setAvailableDays] = useState<EventInformation[]>([]);
  const [selectedDate, setSelectedDate] = useState<String>();
  const [selectedDoctor, setSelectedDoctor] = useState<String>();
  const [selectedVaccination, setSelectedVaccination] =
    useState<VaccinationInformation>();

  const [canConfirm, setCanConfirm] = useState(false);

  let navigate = useNavigate();
  const theme = createTheme();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  yup.setLocale({
    mixed: {
      required: "Pole obowiązkowe",
    },
  });

  useEffect(() => {}, []);

  const handleVaccinationChanged = (data: String) => {
    if (data != null) {
      setSelectedVaccination(
        vaccinationsList.filter((vac) => vac.id === Number(data))[0]
      );
    }
  };

  const handleDateChanged = (data: String) => {
    if (data != null) {
      setSelectedDate(data);
      if (selectedDoctor != null && data != null) {
      }
    }
  };

  const padTo2Digits = (num: string) => {
    return String(num).padStart(2, "0");
  };

  const getFormattedTime = (dateToFormat: Date) => {
    const actualDate = new Date(dateToFormat);
    return (
      padTo2Digits(actualDate.getHours().toString()) +
      ":" +
      padTo2Digits(actualDate.getMinutes().toString())
    );
  };
  const getFormattedDate = (dateToFormat: Date) => {
    const actualDate = new Date(dateToFormat);
    const formatDate =
      actualDate.getDate() < 10
        ? `0${actualDate.getDate()}`
        : actualDate.getDate();
    const formatMonth =
      actualDate.getMonth() < 10
        ? `0${actualDate.getMonth()}`
        : actualDate.getMonth();
    const formattedDate = [
      actualDate.getFullYear(),
      formatMonth,
      formatDate,
    ].join("-");
    return formattedDate;
  };

  const submitHandler: SubmitHandler<EventInformation> = (
    data: EventInformation
  ) => {
    takeEventTerm(data)
      .then((res: any) => {
        enqueueSnackbar("Wizyta została zarejestrowana", {
          anchorOrigin: { vertical: "top", horizontal: "right" },
          variant: "success",
          autoHideDuration: 8000,
          preventDuplicate: true,
        });
      })
      .catch((error: any) => {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
        enqueueSnackbar(error.response.data.message, {
          anchorOrigin: { vertical: "top", horizontal: "right" },
          variant: "error",
          autoHideDuration: 5000,
          preventDuplicate: true,
        });
      });
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EventInformation>({
    resolver: yupResolver(addEventSchema),
    defaultValues: {
      id: eventInformation?.id,
      vacId: eventInformation?.vacId,
      doctorId: newEventDoctor
        ? newEventDoctor?.id
        : eventInformation?.doctorId,
      dateFrom: newEventStartTime
        ? format(new Date(newEventStartTime), "yyyy-MM-dd")
        : eventInformation
        ? format(new Date(eventInformation?.dateFrom), "yyyy-MM-dd")
        : undefined,
      timeFrom: newEventStartTime
        ? getFormattedTime(new Date(newEventStartTime))
        : eventInformation?.dateFrom
        ? getFormattedTime(new Date(eventInformation?.dateFrom))
        : undefined,
    },
  });
  const handleFinishTerm = (data: EventInformation | undefined) => {
    if (data != undefined) {
      finishEventTerm(data)
        .then((res: any) => {
          enqueueSnackbar("Wizyta została zakończona", {
            anchorOrigin: { vertical: "top", horizontal: "right" },
            preventDuplicate: true,
            variant: "success",
            autoHideDuration: 5000,
          });
          if (eventInformation !== undefined) {
            eventInformation.type = 4;
          }
        })
        .catch((error: any) => {
          if (error.response.status === 401) {
            localStorage.clear();
            navigate("/login");
          }
          enqueueSnackbar(error.response.data.message, {
            anchorOrigin: { vertical: "top", horizontal: "right" },
            preventDuplicate: true,
            variant: "error",
            autoHideDuration: 5000,
          });
        });
    }
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit(submitHandler)}>
        <br />
        <Stack spacing={2} direction={"column"}>
          {!isPatient && (
            <Controller
              name="accId"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Pacjent"
                  {...field}
                  fullWidth
                  disabled={isEdit}
                  defaultValue={
                    eventInformation ? eventInformation?.accId : undefined
                  }
                  error={!!errors.accId}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(event);
                  }}
                >
                  {patientsList?.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.firstname + " " + type.lastname}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          )}
          <Stack direction={"row"}>
            <Controller
              name="vacId"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Szczepionka"
                  {...field}
                  fullWidth
                  defaultValue={
                    eventInformation ? eventInformation?.vacId : undefined
                  }
                  error={!!errors.vacId}
                  disabled={eventInformation?.type === 4}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(event);
                    handleVaccinationChanged(event.target.value);
                  }}
                >
                  {vaccinationsList.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Tooltip
              title={selectedVaccination?.description}
              sx={{ fontSize: "13" }}
            >
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          <TextField
            label="Doktor"
            fullWidth
            disabled={true}
            error={!!errors.doctorId}
            defaultValue={
              newEventDoctor
                ? newEventDoctor.firstname + " " + newEventDoctor.lastname
                : selectedDoctor
            }
          ></TextField>
          {!!eventInformation && !!availableDays ? (
            <Controller
              name="dateFrom"
              control={control}
              render={({ field }) => (
                <TextField
                  id="date"
                  type="date"
                  label="Data"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...field}
                  fullWidth
                  disabled={true}
                  error={!!errors.dateFrom}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(event);
                    handleDateChanged(event.target.value);
                  }}
                ></TextField>
              )}
            />
          ) : (
            <Controller
              name="dateFrom"
              control={control}
              render={({ field }) => (
                <TextField
                  id="date"
                  type="date"
                  label="Data"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...field}
                  fullWidth
                  disabled={true}
                  defaultValue={
                    newEventStartTime
                      ? getFormattedDate(new Date(newEventStartTime))
                      : undefined
                  }
                  error={!!errors.dateFrom}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(event);
                    handleDateChanged(event.target.value);
                  }}
                ></TextField>
              )}
            />
          )}
          {!!eventInformation && !!availableDays ? (
            <Controller
              name="timeFrom"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Termin"
                  maxRows={5}
                  {...field}
                  fullWidth
                  defaultValue={
                    eventInformation
                      ? getFormattedTime(new Date(eventInformation?.timeFrom))
                      : undefined
                  }
                  disabled={true}
                  error={!!errors.timeFrom}
                ></TextField>
              )}
            />
          ) : (
            <Controller
              name="timeFrom"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Termin"
                  maxRows={5}
                  {...field}
                  fullWidth
                  defaultValue={
                    newEventStartTime
                      ? getFormattedTime(new Date(newEventStartTime))
                      : undefined
                  }
                  disabled={true}
                  error={!!errors.timeFrom}
                >
                  {availableDays.map((type) => (
                    <MenuItem key={type.timeFrom} value={type.timeFrom}>
                      {getFormattedTime(new Date(type.timeFrom))}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          )}
          <Stack direction={"column"} spacing={2}>
            <Button
              onClick={() => {
                handleFinishTerm(eventInformation);
              }}
              variant="contained"
              color="info"
              disabled={eventInformation?.type !== 2}
              endIcon={<CheckCircleOutlineIcon />}
            >
              Potwierdź wizytę
            </Button>
          </Stack>
          <Stack
            direction="row"
            spacing={5}
            my={3}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={eventInformation?.type === 4}
              endIcon={
                isEdit ? (
                  <>
                    {" "}
                    <SaveAsIcon />
                  </>
                ) : (
                  <>
                    <PostAddIcon />
                  </>
                )
              }
            >
              {isEdit ? "Zatwierdź zmiany" : "Zapisz wizytę"}
            </Button>
            <Button
              onClick={onClose}
              variant="contained"
              color="error"
              endIcon={<BlockIcon />}
            >
              Zamknij
            </Button>
          </Stack>
        </Stack>
        <br />
      </form>
    </Container>
  );
};

export default EventAddEditForm;
