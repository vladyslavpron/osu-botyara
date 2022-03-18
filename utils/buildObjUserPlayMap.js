function buildObjUserPlayMap(score, userProfile) {
  const user = {
    username: score.user.username,
    avatarUrl: score.user.avatar_url,
    performancePoints: userProfile.statistics.pp.toFixed(),
    countryCode: score.user.country_code,
    globalRank: userProfile.statistics.global_rank,
    countryRank: userProfile.statistics.country_rank,
    supporter: score.user.is_supporter,
  };
  const map = {
    id: score.beatmap.id,
    status: score.beatmap.status,
    url: score.beatmap.url,
    cs: score.beatmap.cs.toFixed(1),
    bpm: score.beatmap.bpm,
    covers: score.beatmapset.covers,
    duration: score.beatmap.total_length,
    hp: score.beatmap.drain.toFixed(1),
    objects:
      score.beatmap.count_circles +
      score.beatmap.count_sliders +
      score.beatmap.count_spinners,
  };
  const play = {
    mods: score.mods,
    pp: score.pp ? score.pp.toFixed() : null,
    score: score.score,
    rank: score.rank,
    combo: score.max_combo,
    accuracy: score.accuracy,
    date: score.created_at,
    count300: score.statistics.count_300,
    count100: score.statistics.count_100,
    count50: score.statistics.count_50,
    countMiss: score.statistics.count_miss,
  };
  if (play.mods.includes("DT")) {
    map.bpm = map.bpm * 1.5;
    map.duration = (map.duration / 1.5).toFixed();
  }
  if (play.mods.includes("HT")) {
    map.bpm = map.bpm * 0.75;
    map.duration = (map.duration * 1.33).toFixed();
  }
  return { user, play, map };
}

module.exports = buildObjUserPlayMap;
