import {
  AudioFileType,
  PodcastRequestType,
  addAudioFiles,
  deleteAudiFile,
} from "@/api/podcast";
import {
  Button,
  Card,
  FileInput,
  Modal,
  Spinner,
  ToggleSwitch,
} from "flowbite-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface AudioFileCardProps extends AudioFileType {
  handleDelete: () => void;
}

function getYouTubeVideoId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  } else {
    // Handle invalid or unsupported YouTube URL
    return null;
  }
}

const AudioFileCard = (props: AudioFileCardProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteAudiFile(props.id);
      setLoading(false);
      props.handleDelete();
    } catch (e) {
      setLoading(false);
    }
  };

  var videoUrl = props?.youtube_link
    ? "https://www.youtube.com/embed/" + getYouTubeVideoId(props?.youtube_link)
    : null;

  return (
    <Card key={props.title} className="max-w-sm">
      <div className="h-full flex flex-col justify-between gap-3">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {props.title}
        </h5>
        <p className="font-normal text-lg text-gray-700 dark:text-gray-400">
          {props.transcript}
        </p>
        {props.audio_file ? (
          <audio id="audioPlayer" className="w-full mb-4" controls>
            <source src={props?.audio_file} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
        ) : null}

        {videoUrl ? (
          <iframe className="w-full h-auto object-cover z-2" src={videoUrl} />
        ) : null}

        <Button
          disabled={loading}
          onClick={handleDelete}
          className="w-full disabled:bg-blue-50 text-white bg-blue-400 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

const PodcastDashboard = ({ audioFiles }: { audioFiles: AudioFileType[] }) => {
  const [audioFilesState, setAudioFilesState] =
    useState<AudioFileType[]>(audioFiles);
  const {
    register,
    control,
    formState: { errors },
    watch,
    handleSubmit,
    setValue,
  } = useForm<PodcastRequestType>();
  const [openModal, setOpenModal] = useState(false);
  const [addPodcastLoading, setAddPodcastLoading] = useState(false);
  const [isAudioFile, setIsAudioFIle] = useState(true);

  const handleChangeFileType = (value: boolean) => {
    if (value) {
      setIsAudioFIle(true);
      setValue("youtube_link", "");
    } else {
      setIsAudioFIle(false);
      setValue("audio_file", undefined);
    }
  };

  const values = watch();

  useEffect(() => {
    setAudioFilesState(audioFiles);
  }, [audioFiles]);

  const handleDelete = async (id: string) => {
    const updatedState = [...audioFilesState].filter((e) => e.id !== id);
    setAudioFilesState(updatedState);
  };

  const handleSubmitForm = async (value: PodcastRequestType) => {
    setAddPodcastLoading(true);
    try {
      let response = await addAudioFiles(value);
      const updatedState = [...audioFilesState, response.data];
      setAudioFilesState(updatedState);
      setOpenModal(false);
    } catch (e) {}
    setAddPodcastLoading(false);
  };

  const handleClosePodcastModal = () => {
    if (!addPodcastLoading) {
      setOpenModal(false);
    }
  };

  return (
    <div className="relative">
      <Modal show={openModal} onClose={handleClosePodcastModal}>
        <Modal.Header>Add new podcast</Modal.Header>
        <Modal.Body>
          <form className="space-y-6">
            <div className="flex gap-4">
              <span> Youtube link</span>
              <ToggleSwitch
                onChange={handleChangeFileType}
                checked={isAudioFile}
              />
              <span> Audio file </span>
            </div>
            {isAudioFile ? (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Audio file
                </label>
                <Controller
                  name="audio_file"
                  control={control}
                  rules={{
                    required: {
                      value: !!isAudioFile,
                      message: "This field is required",
                    },
                  }}
                  render={({ field }) => (
                    <FileInput
                      disabled={addPodcastLoading}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        //@ts-ignore
                        field.onChange(e?.target?.files[0])
                      }
                    />
                  )}
                />
                {errors.audio_file ? (
                  <span className="text-red-600 text-sm">
                    {errors.audio_file?.message}
                  </span>
                ) : null}
              </div>
            ) : (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Youtube link
                </label>
                <input
                  disabled={addPodcastLoading}
                  {...register("youtube_link", {
                    required: {
                      value: !isAudioFile,
                      message: "This field is required",
                    },
                  })}
                  name="youtube_link"
                  id="youtube_link"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.youtube_link ? (
                  <span className="text-red-600 text-sm">
                    {errors.youtube_link?.message}
                  </span>
                ) : null}
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Title
              </label>
              <input
                {...register("title", {
                  required: {
                    value: true,
                    message: "Title is required",
                  },
                })}
                disabled={addPodcastLoading}
                name="title"
                id="title"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {errors.title ? (
                <span className="text-red-600 text-sm">
                  {errors.title?.message}
                </span>
              ) : null}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Transcript
              </label>
              <input
                disabled={addPodcastLoading}
                {...register("transcript")}
                name="transcript"
                id="transcript"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />

              {errors.transcript ? (
                <span className="text-red-600 text-sm">
                  {errors.transcript?.message}
                </span>
              ) : null}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={addPodcastLoading}
            onClick={handleSubmit(handleSubmitForm)}
          >
            Submit{" "}
            {addPodcastLoading ? (
              <div className="px-3">
                <Spinner />
              </div>
            ) : null}
          </Button>
          <Button
            disabled={addPodcastLoading}
            onClick={handleClosePodcastModal}
            color="gray"
          >
            Decline
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="w-full bg-blue-300">
        <div className="container mx-auto px-4 py-4">
          <div className="w-full  flex justify-between items-center text-white">
            <p className="font-bold text-lg">Audio Files</p>
            <Button onClick={() => setOpenModal(true)}>Add new one</Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-4 grid gap-4 md:grid-cols-4 grid-cols-1">
        {audioFilesState?.length ? (
          audioFilesState.map((e) => (
            <AudioFileCard
              key={e.id}
              {...e}
              handleDelete={() => handleDelete(e.id)}
            />
          ))
        ) : (
          <p className="font-bold p-6 text-lg">No podcasts yet!!!</p>
        )}
      </div>
    </div>
  );
};

export default PodcastDashboard;
