// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'trader_mirror_insights.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TraderMirrorInsights extends TraderMirrorInsights {
  @override
  final int windowDays;
  @override
  final int totalResolved;
  @override
  final bool overallGated;
  @override
  final MirrorGatedInsight sessions;
  @override
  final MirrorGatedInsight instruments;
  @override
  final MirrorGatedInsight timing;
  @override
  final MirrorGatedInsight postLoss;
  @override
  final MirrorGatedInsight exitDiscipline;

  factory _$TraderMirrorInsights(
          [void Function(TraderMirrorInsightsBuilder)? updates]) =>
      (TraderMirrorInsightsBuilder()..update(updates))._build();

  _$TraderMirrorInsights._(
      {required this.windowDays,
      required this.totalResolved,
      required this.overallGated,
      required this.sessions,
      required this.instruments,
      required this.timing,
      required this.postLoss,
      required this.exitDiscipline})
      : super._();
  @override
  TraderMirrorInsights rebuild(
          void Function(TraderMirrorInsightsBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TraderMirrorInsightsBuilder toBuilder() =>
      TraderMirrorInsightsBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TraderMirrorInsights &&
        windowDays == other.windowDays &&
        totalResolved == other.totalResolved &&
        overallGated == other.overallGated &&
        sessions == other.sessions &&
        instruments == other.instruments &&
        timing == other.timing &&
        postLoss == other.postLoss &&
        exitDiscipline == other.exitDiscipline;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, windowDays.hashCode);
    _$hash = $jc(_$hash, totalResolved.hashCode);
    _$hash = $jc(_$hash, overallGated.hashCode);
    _$hash = $jc(_$hash, sessions.hashCode);
    _$hash = $jc(_$hash, instruments.hashCode);
    _$hash = $jc(_$hash, timing.hashCode);
    _$hash = $jc(_$hash, postLoss.hashCode);
    _$hash = $jc(_$hash, exitDiscipline.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TraderMirrorInsights')
          ..add('windowDays', windowDays)
          ..add('totalResolved', totalResolved)
          ..add('overallGated', overallGated)
          ..add('sessions', sessions)
          ..add('instruments', instruments)
          ..add('timing', timing)
          ..add('postLoss', postLoss)
          ..add('exitDiscipline', exitDiscipline))
        .toString();
  }
}

class TraderMirrorInsightsBuilder
    implements Builder<TraderMirrorInsights, TraderMirrorInsightsBuilder> {
  _$TraderMirrorInsights? _$v;

  int? _windowDays;
  int? get windowDays => _$this._windowDays;
  set windowDays(int? windowDays) => _$this._windowDays = windowDays;

  int? _totalResolved;
  int? get totalResolved => _$this._totalResolved;
  set totalResolved(int? totalResolved) =>
      _$this._totalResolved = totalResolved;

  bool? _overallGated;
  bool? get overallGated => _$this._overallGated;
  set overallGated(bool? overallGated) => _$this._overallGated = overallGated;

  MirrorGatedInsightBuilder? _sessions;
  MirrorGatedInsightBuilder get sessions =>
      _$this._sessions ??= MirrorGatedInsightBuilder();
  set sessions(MirrorGatedInsightBuilder? sessions) =>
      _$this._sessions = sessions;

  MirrorGatedInsightBuilder? _instruments;
  MirrorGatedInsightBuilder get instruments =>
      _$this._instruments ??= MirrorGatedInsightBuilder();
  set instruments(MirrorGatedInsightBuilder? instruments) =>
      _$this._instruments = instruments;

  MirrorGatedInsightBuilder? _timing;
  MirrorGatedInsightBuilder get timing =>
      _$this._timing ??= MirrorGatedInsightBuilder();
  set timing(MirrorGatedInsightBuilder? timing) => _$this._timing = timing;

  MirrorGatedInsightBuilder? _postLoss;
  MirrorGatedInsightBuilder get postLoss =>
      _$this._postLoss ??= MirrorGatedInsightBuilder();
  set postLoss(MirrorGatedInsightBuilder? postLoss) =>
      _$this._postLoss = postLoss;

  MirrorGatedInsightBuilder? _exitDiscipline;
  MirrorGatedInsightBuilder get exitDiscipline =>
      _$this._exitDiscipline ??= MirrorGatedInsightBuilder();
  set exitDiscipline(MirrorGatedInsightBuilder? exitDiscipline) =>
      _$this._exitDiscipline = exitDiscipline;

  TraderMirrorInsightsBuilder() {
    TraderMirrorInsights._defaults(this);
  }

  TraderMirrorInsightsBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _windowDays = $v.windowDays;
      _totalResolved = $v.totalResolved;
      _overallGated = $v.overallGated;
      _sessions = $v.sessions.toBuilder();
      _instruments = $v.instruments.toBuilder();
      _timing = $v.timing.toBuilder();
      _postLoss = $v.postLoss.toBuilder();
      _exitDiscipline = $v.exitDiscipline.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TraderMirrorInsights other) {
    _$v = other as _$TraderMirrorInsights;
  }

  @override
  void update(void Function(TraderMirrorInsightsBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TraderMirrorInsights build() => _build();

  _$TraderMirrorInsights _build() {
    _$TraderMirrorInsights _$result;
    try {
      _$result = _$v ??
          _$TraderMirrorInsights._(
            windowDays: BuiltValueNullFieldError.checkNotNull(
                windowDays, r'TraderMirrorInsights', 'windowDays'),
            totalResolved: BuiltValueNullFieldError.checkNotNull(
                totalResolved, r'TraderMirrorInsights', 'totalResolved'),
            overallGated: BuiltValueNullFieldError.checkNotNull(
                overallGated, r'TraderMirrorInsights', 'overallGated'),
            sessions: sessions.build(),
            instruments: instruments.build(),
            timing: timing.build(),
            postLoss: postLoss.build(),
            exitDiscipline: exitDiscipline.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'sessions';
        sessions.build();
        _$failedField = 'instruments';
        instruments.build();
        _$failedField = 'timing';
        timing.build();
        _$failedField = 'postLoss';
        postLoss.build();
        _$failedField = 'exitDiscipline';
        exitDiscipline.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'TraderMirrorInsights', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
