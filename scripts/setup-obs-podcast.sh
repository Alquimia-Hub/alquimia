#!/usr/bin/env bash
#
# Creates the "Noches de Alquimia" OBS profile and scene collection on macOS.
# Other profiles and scene collections are left untouched.
#
#   scripts/setup-obs-podcast.sh --name brian --mic "Scarlett Solo USB"
#   scripts/setup-obs-podcast.sh --name nico
#
# Options:
#   --name <name>        Recording file prefix (default: current user)
#   --mic <device>       Microphone name, or part of it (default: built-in mic)
#   --camera <device>    Camera name, or part of it (default: FaceTime camera)
#   --browser <bundle>   Browser running the call (default: com.google.Chrome)
#   --list               List the available devices and exit

set -euo pipefail

OBS_NAME="Noches de Alquimia"
OBS_DIR_NAME="Noches_de_Alquimia"
OBS_CONFIG="$HOME/Library/Application Support/obs-studio"
PROFILE_DIR="$OBS_CONFIG/basic/profiles/$OBS_DIR_NAME"
SCENES_FILE="$OBS_CONFIG/basic/scenes/$OBS_DIR_NAME.json"
RECORDINGS_DIR="$HOME/Movies/NochesDeAlquimia"

name="$(id -un)"
mic_query="MacBook"
camera_query="FaceTime"
browser="com.google.Chrome"
list_only=false

fail() {
  echo "Error: $1" >&2
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --name) name="${2:?}"; shift 2 ;;
    --mic) mic_query="${2:?}"; shift 2 ;;
    --camera) camera_query="${2:?}"; shift 2 ;;
    --browser) browser="${2:?}"; shift 2 ;;
    --list) list_only=true; shift ;;
    *) fail "opción desconocida: $1" ;;
  esac
done

[[ "$(uname)" == "Darwin" ]] || fail "este script es solo para macOS."
[[ -d /Applications/OBS.app ]] || fail "no encontré OBS en /Applications."

# Prints "<soun|vide>\t<name>\t<unique id>" per capture device. JXA ships with
# macOS, so the script needs nothing else installed.
list_devices() {
  osascript -l JavaScript -e '
    $.NSBundle.bundleWithPath("/System/Library/Frameworks/AVFoundation.framework").load;
    const AVCaptureDevice = $.NSClassFromString("AVCaptureDevice");
    const lines = [];
    for (const type of ["soun", "vide"]) {
      const devices = AVCaptureDevice.devicesWithMediaType(type);
      for (let i = 0; i < devices.count; i++) {
        const device = devices.objectAtIndex(i);
        lines.push([type, device.localizedName.js, device.uniqueID.js].join("\t"));
      }
    }
    lines.join("\n");
  '
}

devices="$(list_devices)"

if [[ "$list_only" == true ]]; then
  echo "$devices"
  exit 0
fi

# Prints the "<name>\t<unique id>" of the first device of a type matching a query.
find_device() {
  echo "$devices" | awk -F '\t' -v type="$1" -v query="$2" '
    $1 == type && index(tolower($2), tolower(query)) { print $2 "\t" $3; exit }
  '
}

mic="$(find_device soun "$mic_query")"
camera="$(find_device vide "$camera_query")"
[[ -n "$mic" ]] || fail "no encontré el micrófono \"$mic_query\". Probá con --list."
[[ -n "$camera" ]] || fail "no encontré la cámara \"$camera_query\". Probá con --list."
IFS=$'\t' read -r mic_name mic_id <<<"$mic"
IFS=$'\t' read -r camera_name camera_id <<<"$camera"

if pgrep -x OBS >/dev/null; then
  fail "OBS está abierto. Cerralo y volvé a correr el script."
fi

if [[ -e "$PROFILE_DIR" || -e "$SCENES_FILE" ]]; then
  backup_suffix="bak-$(date +%Y%m%d%H%M%S)"
  [[ -e "$PROFILE_DIR" ]] && mv "$PROFILE_DIR" "$PROFILE_DIR.$backup_suffix"
  [[ -e "$SCENES_FILE" ]] && mv "$SCENES_FILE" "$SCENES_FILE.$backup_suffix"
fi

mkdir -p "$PROFILE_DIR" "$(dirname "$SCENES_FILE")" "$RECORDINGS_DIR"

# Track 1: microphone. Track 2: call audio, used to sync both recordings.
# RecTracks is a bitmask, so 3 records tracks 1 and 2.
cat >"$PROFILE_DIR/basic.ini" <<EOF
[General]
Name=$OBS_NAME

[Output]
Mode=Advanced
FilenameFormatting=${name}_%CCYY-%MM-%DD_%hh-%mm-%ss

[AdvOut]
RecType=Standard
RecFilePath=$RECORDINGS_DIR
RecFormat2=hybrid_mp4
RecUseRescale=false
RecTracks=3
RecEncoder=com.apple.videotoolbox.videoencoder.ave.avc
RecAudioEncoder=ffmpeg_alac
Track1Name=Voz
Track2Name=Llamada

[Video]
BaseCX=3840
BaseCY=1080
OutputCX=3840
OutputCY=1080
FPSType=0
FPSCommon=30
ScaleType=bicubic
ColorFormat=NV12
ColorSpace=709
ColorRange=Partial

[Audio]
SampleRate=48000
ChannelSetup=Stereo

[Hotkeys]
OBSBasic.AddChapterMarker={"bindings":[{"alt":true,"control":true,"key":"OBS_KEY_M"}]}
EOF

cat >"$PROFILE_DIR/recordEncoder.json" <<EOF
{"rate_control":"CBR","bitrate":60000,"keyint_sec":2,"profile":"high"}
EOF

scene_uuid="$(uuidgen | tr '[:upper:]' '[:lower:]')"
camera_uuid="$(uuidgen | tr '[:upper:]' '[:lower:]')"
screen_uuid="$(uuidgen | tr '[:upper:]' '[:lower:]')"
mic_uuid="$(uuidgen | tr '[:upper:]' '[:lower:]')"
call_uuid="$(uuidgen | tr '[:upper:]' '[:lower:]')"

# Mic flags: 2 forces mono. Camera on the left half, screen on the right half.
cat >"$SCENES_FILE" <<EOF
{
  "name": "$OBS_NAME",
  "current_scene": "Grabación",
  "current_program_scene": "Grabación",
  "scene_order": [{ "name": "Grabación" }],
  "groups": [],
  "quick_transitions": [],
  "transitions": [],
  "saved_projectors": [],
  "current_transition": "Fade",
  "transition_duration": 300,
  "sources": [
    {
      "id": "scene", "versioned_id": "scene", "name": "Grabación", "uuid": "$scene_uuid",
      "mixers": 0,
      "settings": {
        "id_counter": 4,
        "custom_size": false,
        "items": [
          {
            "name": "Cámara", "source_uuid": "$camera_uuid", "id": 1, "visible": true, "locked": true,
            "rot": 0.0, "pos": { "x": 0.0, "y": 0.0 }, "scale": { "x": 1.0, "y": 1.0 }, "align": 5,
            "bounds_type": 2, "bounds_align": 0, "bounds": { "x": 1920.0, "y": 1080.0 },
            "crop_left": 0, "crop_top": 0, "crop_right": 0, "crop_bottom": 0
          },
          {
            "name": "Pantalla", "source_uuid": "$screen_uuid", "id": 2, "visible": true, "locked": true,
            "rot": 0.0, "pos": { "x": 1920.0, "y": 0.0 }, "scale": { "x": 1.0, "y": 1.0 }, "align": 5,
            "bounds_type": 2, "bounds_align": 0, "bounds": { "x": 1920.0, "y": 1080.0 },
            "crop_left": 0, "crop_top": 0, "crop_right": 0, "crop_bottom": 0
          },
          {
            "name": "Micrófono", "source_uuid": "$mic_uuid", "id": 3, "visible": true, "locked": true,
            "rot": 0.0, "pos": { "x": 0.0, "y": 0.0 }, "scale": { "x": 1.0, "y": 1.0 }, "align": 5,
            "bounds_type": 0, "bounds_align": 0, "bounds": { "x": 0.0, "y": 0.0 },
            "crop_left": 0, "crop_top": 0, "crop_right": 0, "crop_bottom": 0
          },
          {
            "name": "Llamada", "source_uuid": "$call_uuid", "id": 4, "visible": true, "locked": true,
            "rot": 0.0, "pos": { "x": 0.0, "y": 0.0 }, "scale": { "x": 1.0, "y": 1.0 }, "align": 5,
            "bounds_type": 0, "bounds_align": 0, "bounds": { "x": 0.0, "y": 0.0 },
            "crop_left": 0, "crop_top": 0, "crop_right": 0, "crop_bottom": 0
          }
        ]
      }
    },
    {
      "id": "macos-avcapture", "versioned_id": "macos-avcapture", "name": "Cámara", "uuid": "$camera_uuid",
      "mixers": 0,
      "settings": { "device": "$camera_id", "device_name": "$camera_name", "enable_audio": false }
    },
    {
      "id": "screen_capture", "versioned_id": "screen_capture", "name": "Pantalla", "uuid": "$screen_uuid",
      "mixers": 0,
      "settings": { "type": 0, "show_cursor": true, "hide_obs": true }
    },
    {
      "id": "coreaudio_input_capture", "versioned_id": "coreaudio_input_capture", "name": "Micrófono", "uuid": "$mic_uuid",
      "mixers": 1, "flags": 2, "monitoring_type": 0,
      "settings": { "device_id": "$mic_id" }
    },
    {
      "id": "sck_audio_capture", "versioned_id": "sck_audio_capture", "name": "Llamada", "uuid": "$call_uuid",
      "mixers": 2, "monitoring_type": 0,
      "settings": { "type": 1, "application": "$browser" }
    }
  ]
}
EOF

cat <<EOF
OBS listo: perfil y colección "$OBS_NAME".

  Micrófono:   $mic_name
  Cámara:      $camera_name
  Llamada:     $browser
  Grabaciones: $RECORDINGS_DIR
  Marcas:      Ctrl+Option+M

Para abrirlo:
  open -a OBS --args --profile "$OBS_NAME" --collection "$OBS_NAME"
EOF
