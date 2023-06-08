import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Header from "../Header";
import Copyright from "../Copyright";
import {
  Dialog,
  DialogContent,
  MenuItem,
  Skeleton,
  TextField,
} from "@mui/material";
import { Suspense, useEffect, useState } from "react";
import { addLocale, locale } from "primereact/api";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import { getDoctors, getPatients, UserData } from "../../../api/ApiAccount";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import {
  getVaccinationList,
  VaccinationInformation,
} from "../../../api/ApiVaccination";
import "../../../App.css";

import {
  Agenda,
  Day,
  EventSettingsModel,
  Inject,
  Month,
  PopupOpenEventArgs,
  ScheduleComponent,
  ViewDirective,
  ViewsDirective,
  WorkWeek,
} from "@syncfusion/ej2-react-schedule";
import { Ajax, L10n, setCulture, loadCldr } from "@syncfusion/ej2-base";
import EventAddEditForm from "./forms/EventAddEditForm";

loadCldr(
  require("cldr-data/supplemental/numberingSystems.json"),
  require("cldr-data/main/pl/ca-gregorian.json"),
  require("cldr-data/main/pl/numbers.json"),
  require("cldr-data/main/pl/timeZoneNames.json")
);

L10n.load({
  pl: {
    schedule: {
      day: "Dzień",
      week: "Tydzień",
      workWeek: "Tydzień pracy",
      month: "Miesiąc",
      year: "Rok",
      agenda: "Program",
      weekAgenda: "Program tygodniowy",
      workWeekAgenda: "Agenda Tygodnia Pracy",
      monthAgenda: "Agenda miesiąca",
      today: "Dzisiaj",
      noEvents: "Brak wydarzeń",
      emptyContainer: "Na ten dzień nie zaplanowano żadnych wydarzeń.",
      allDay: "Cały dzień",
      start: "Początek",
      end: "Koniec",
      more: "więcej",
      close: "Blisko",
      cancel: "Anuluj",
      noTitle: "(Bez tytułu)",
      delete: "Usuń",
      deleteEvent: "Usuń wydarzenie",
      deleteMultipleEvent: "Usuń wiele wydarzeń",
      selectedItems: "Wybrane elementy",
      deleteSeries: "Cała seria",
      edit: "Edytować",
      editSeries: "Cała seria",
      editEvent: "Wydarzenie",
      createEvent: "Stwórz",
      subject: "Przedmiot",
      addTitle: "Dodaj tytuł",
      moreDetails: "Więcej szczegółów",
      save: "Zapisz",
      editContent: "Jak chciałbyś zmienić spotkanie w serialu?",
      deleteContent: "Czy na pewno chcesz usunąć to wydarzenie?",
      deleteMultipleContent: "Czy na pewno chcesz usunąć wybrane wydarzenia?",
      newEvent: "Wyjazd",
      title: "Tytuł",
      location: "Lokalizacja",
      description: "Opis",
      timezone: "Strefa czasowa",
      startTimezone: "Uruchom strefę czasową",
      endTimezone: "Koniec strefy czasowej",
      repeat: "Powtarzać",
      saveButton: "Zapisz",
      cancelButton: "Anuluj",
      deleteButton: "Usuń",
      recurrence: "Nawrót",
      wrongPattern: "Wzorzec powtarzania się jest nieprawidłowy.",
      seriesChangeAlert:
        "Czy chcesz anulować zmiany wprowadzone w określonych wystąpieniach tej serii i ponownie dopasować ją do całej serii?",
      createError:
        "Czas trwania wydarzenia musi być krótszy niż częstotliwość jego występowania. Skróć czas trwania lub zmień wzorzec cyklu w edytorze zdarzeń cyklicznych.",
      sameDayAlert:
        "Dwa wystąpienia tego samego zdarzenia nie mogą wystąpić tego samego dnia.",
      occurenceAlert:
        "Nie można przełożyć wystąpienia spotkania cyklicznego, jeśli pomija późniejsze wystąpienie tego samego spotkania.",
      editRecurrence: "Edytuj cykl",
      repeats: "Powtarza się",
      alert: "Alarm",
      startEndError: "Wybrana data końcowa występuje przed datą początkową.",
      invalidDateError: "Wprowadzona wartość daty jest nieprawidłowa.",
      blockAlert:
        "Zdarzenia nie mogą być zaplanowane w zablokowanym przedziale czasowym.",
      ok: "Dobrze",
      yes: "tak",
      no: "Nie",
      occurrence: "Występowanie",
      series: "Seria",
      previous: "Poprzedni",
      next: "Kolejny",
      timelineDay: "Dzień na osi czasu",
      timelineWeek: "Tydzień na osi czasu",
      timelineWorkWeek: "Tydzień roboczy osi czasu",
      timelineMonth: "Miesiąc osi czasu",
      timelineYear: "Rok na osi czasu",
      editFollowingEvent: "Następujące wydarzenia",
      deleteTitle: "Usuń wydarzenie",
      editTitle: "Edytuj wydarzenie",
      beginFrom: "Zacząć od",
      endAt: "Koniec o",
      expandAllDaySection: "Rozwiń sekcję całodniową",
      collapseAllDaySection: "Zwiń sekcję całodniową",
      searchTimezone: "Wyszukaj strefę czasową",
      noRecords: "Nic nie znaleziono",
    },
  },
});

export type EventMappedInformation = {
  Id: number;
  Subject: String;
  StartTime: Date;
  EndTime: Date;
};

export default function DashboardContent() {
  const [openAddEditEventDialog, setOpenAddEditEventDialog] = useState(false);
  const [openAddEditEventDialogUndefined, setOpenAddEditEventDialogUndefined] =
    useState(false);
  const [doctorsList, setDoctorsList] = useState<UserData[]>([]);
  const [patientsList, setPatientsList] = useState<UserData[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<UserData>();
  const [vaccinationList, setVaccinationList] = useState<
    VaccinationInformation[]
  >([]);
  const [mappedEvents, setMappedEvents] = useState<EventMappedInformation[]>(
    []
  );
  const [newEventStart, setNewEventStart] = useState<string>("");

  let navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleCloseAddEditEventDialog = () => {
    setOpenAddEditEventDialog(false);
    setOpenAddEditEventDialogUndefined(false);
  };

  const eventSettings: EventSettingsModel = { dataSource: mappedEvents };

  useEffect(() => {
    getDoctors()
      .then((res) => {
        setDoctorsList(res.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          enqueueSnackbar(error.response.data.message, {
            anchorOrigin: { vertical: "top", horizontal: "right" },
            preventDuplicate: true,
            variant: "error",
            autoHideDuration: 5000,
          });
        }
      });
    getPatients()
      .then((res) => {
        setPatientsList(res.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          enqueueSnackbar(error.response.data.message, {
            anchorOrigin: { vertical: "top", horizontal: "right" },
            preventDuplicate: true,
            variant: "error",
            autoHideDuration: 5000,
          });
        }
      });
    getVaccinationList()
      .then((res) => {
        setVaccinationList(res.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          enqueueSnackbar(error.response.data.message, {
            anchorOrigin: { vertical: "top", horizontal: "right" },
            preventDuplicate: true,
            variant: "error",
            autoHideDuration: 5000,
          });
        }
      });
  }, []);

  function onPopupOpen(args: PopupOpenEventArgs): void {
    setNewEventStart(args.data?.startTime);
    setOpenAddEditEventDialog(true);
    setOpenAddEditEventDialogUndefined(true);
    args.cancel = true;
  }
  function onEventRendered(args: any) {
    let categoryColor = args.data.Color;
    args.element.style.backgroundColor = categoryColor;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper
                sx={{ p: 2, display: "flex", flexDirection: "column" }}
              ></Paper>
            </Grid>
            <Grid item xs={12}>
              {doctorsList.length === 0 ? (
                <div>
                  <Skeleton variant="rounded" height={60} />
                </div>
              ) : (
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <TextField
                    label="Doktor"
                    select
                    fullWidth
                    style={{ textAlign: "left" }}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setSelectedDoctor(
                        doctorsList.filter(
                          (doc) => doc.id === Number(event.target.value)
                        )[0]
                      );
                    }}
                  >
                    {doctorsList.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.firstname + " " + type.lastname}
                      </MenuItem>
                    ))}
                  </TextField>
                </Paper>
              )}
            </Grid>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <ScheduleComponent
                  height="60vh"
                  currentView="WorkWeek"
                  locale="pl"
                  selectedDate={new Date()}
                  popupOpen={onPopupOpen}
                  eventRendered={onEventRendered}
                  eventSettings={eventSettings}
                  timeScale={{ enable: true, interval: 15, slotCount: 1 }}
                >
                  <ViewsDirective>
                    <ViewDirective
                      option="WorkWeek"
                      startHour="8:00"
                      endHour="16:00"
                    />
                    <ViewDirective
                      option="Day"
                      showWeekend={false}
                      startHour="8:00"
                      endHour="16:00"
                    />
                    <ViewDirective
                      option="Month"
                      showWeekend={false}
                      startHour="8:00"
                      endHour="16:00"
                    />
                  </ViewsDirective>
                  <Inject services={[Day, WorkWeek, Month, Agenda]} />
                </ScheduleComponent>
              </Paper>
            </Grid>
          </Grid>
          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Box>
      <Suspense fallback={<Skeleton height={"50vh"} />}>
        <Dialog
          open={openAddEditEventDialog}
          onClose={handleCloseAddEditEventDialog}
        >
          <DialogContent>
            <EventAddEditForm
              onClose={handleCloseAddEditEventDialog}
              doctorsList={doctorsList}
              patientsList={patientsList}
              vaccinationsList={vaccinationList.filter((vac) => vac.isActive)}
              newEventStartTime={newEventStart}
              newEventDoctor={
                selectedDoctor !== undefined ? selectedDoctor : undefined
              }
              isPatient={false}
            />
          </DialogContent>
        </Dialog>
      </Suspense>
    </Box>
  );
}
