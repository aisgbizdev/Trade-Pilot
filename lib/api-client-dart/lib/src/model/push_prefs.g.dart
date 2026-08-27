// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'push_prefs.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const PushPrefsMarketOpenSessionsEnum _$pushPrefsMarketOpenSessionsEnum_tokyo =
    const PushPrefsMarketOpenSessionsEnum._('tokyo');
const PushPrefsMarketOpenSessionsEnum _$pushPrefsMarketOpenSessionsEnum_london =
    const PushPrefsMarketOpenSessionsEnum._('london');
const PushPrefsMarketOpenSessionsEnum
    _$pushPrefsMarketOpenSessionsEnum_newyork =
    const PushPrefsMarketOpenSessionsEnum._('newyork');

PushPrefsMarketOpenSessionsEnum _$pushPrefsMarketOpenSessionsEnumValueOf(
    String name) {
  switch (name) {
    case 'tokyo':
      return _$pushPrefsMarketOpenSessionsEnum_tokyo;
    case 'london':
      return _$pushPrefsMarketOpenSessionsEnum_london;
    case 'newyork':
      return _$pushPrefsMarketOpenSessionsEnum_newyork;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<PushPrefsMarketOpenSessionsEnum>
    _$pushPrefsMarketOpenSessionsEnumValues = BuiltSet<
        PushPrefsMarketOpenSessionsEnum>(const <PushPrefsMarketOpenSessionsEnum>[
  _$pushPrefsMarketOpenSessionsEnum_tokyo,
  _$pushPrefsMarketOpenSessionsEnum_london,
  _$pushPrefsMarketOpenSessionsEnum_newyork,
]);

Serializer<PushPrefsMarketOpenSessionsEnum>
    _$pushPrefsMarketOpenSessionsEnumSerializer =
    _$PushPrefsMarketOpenSessionsEnumSerializer();

class _$PushPrefsMarketOpenSessionsEnumSerializer
    implements PrimitiveSerializer<PushPrefsMarketOpenSessionsEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'tokyo': 'tokyo',
    'london': 'london',
    'newyork': 'newyork',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'tokyo': 'tokyo',
    'london': 'london',
    'newyork': 'newyork',
  };

  @override
  final Iterable<Type> types = const <Type>[PushPrefsMarketOpenSessionsEnum];
  @override
  final String wireName = 'PushPrefsMarketOpenSessionsEnum';

  @override
  Object serialize(
          Serializers serializers, PushPrefsMarketOpenSessionsEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  PushPrefsMarketOpenSessionsEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      PushPrefsMarketOpenSessionsEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$PushPrefs extends PushPrefs {
  @override
  final bool pushExpiry;
  @override
  final bool pushBroadcast;
  @override
  final bool pushDailySummary;
  @override
  final bool pushMarketNews;
  @override
  final bool pushCalendarEvents;
  @override
  final bool pushPriceAnomaly;
  @override
  final bool pushWeeklyRecap;
  @override
  final bool pushSignalFlip;
  @override
  final BuiltList<PushPrefsMarketOpenSessionsEnum> marketOpenSessions;
  @override
  final bool pushDormancyNudge;
  @override
  final bool pushOnboarding;
  @override
  final String? disengageNoticeCategory;
  @override
  final bool guardrailRevenge;
  @override
  final bool guardrailOvertrading;
  @override
  final bool guardrailHighRisk;
  @override
  final bool coolingOffEnabled;

  factory _$PushPrefs([void Function(PushPrefsBuilder)? updates]) =>
      (PushPrefsBuilder()..update(updates))._build();

  _$PushPrefs._(
      {required this.pushExpiry,
      required this.pushBroadcast,
      required this.pushDailySummary,
      required this.pushMarketNews,
      required this.pushCalendarEvents,
      required this.pushPriceAnomaly,
      required this.pushWeeklyRecap,
      required this.pushSignalFlip,
      required this.marketOpenSessions,
      required this.pushDormancyNudge,
      required this.pushOnboarding,
      this.disengageNoticeCategory,
      required this.guardrailRevenge,
      required this.guardrailOvertrading,
      required this.guardrailHighRisk,
      required this.coolingOffEnabled})
      : super._();
  @override
  PushPrefs rebuild(void Function(PushPrefsBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PushPrefsBuilder toBuilder() => PushPrefsBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PushPrefs &&
        pushExpiry == other.pushExpiry &&
        pushBroadcast == other.pushBroadcast &&
        pushDailySummary == other.pushDailySummary &&
        pushMarketNews == other.pushMarketNews &&
        pushCalendarEvents == other.pushCalendarEvents &&
        pushPriceAnomaly == other.pushPriceAnomaly &&
        pushWeeklyRecap == other.pushWeeklyRecap &&
        pushSignalFlip == other.pushSignalFlip &&
        marketOpenSessions == other.marketOpenSessions &&
        pushDormancyNudge == other.pushDormancyNudge &&
        pushOnboarding == other.pushOnboarding &&
        disengageNoticeCategory == other.disengageNoticeCategory &&
        guardrailRevenge == other.guardrailRevenge &&
        guardrailOvertrading == other.guardrailOvertrading &&
        guardrailHighRisk == other.guardrailHighRisk &&
        coolingOffEnabled == other.coolingOffEnabled;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, pushExpiry.hashCode);
    _$hash = $jc(_$hash, pushBroadcast.hashCode);
    _$hash = $jc(_$hash, pushDailySummary.hashCode);
    _$hash = $jc(_$hash, pushMarketNews.hashCode);
    _$hash = $jc(_$hash, pushCalendarEvents.hashCode);
    _$hash = $jc(_$hash, pushPriceAnomaly.hashCode);
    _$hash = $jc(_$hash, pushWeeklyRecap.hashCode);
    _$hash = $jc(_$hash, pushSignalFlip.hashCode);
    _$hash = $jc(_$hash, marketOpenSessions.hashCode);
    _$hash = $jc(_$hash, pushDormancyNudge.hashCode);
    _$hash = $jc(_$hash, pushOnboarding.hashCode);
    _$hash = $jc(_$hash, disengageNoticeCategory.hashCode);
    _$hash = $jc(_$hash, guardrailRevenge.hashCode);
    _$hash = $jc(_$hash, guardrailOvertrading.hashCode);
    _$hash = $jc(_$hash, guardrailHighRisk.hashCode);
    _$hash = $jc(_$hash, coolingOffEnabled.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'PushPrefs')
          ..add('pushExpiry', pushExpiry)
          ..add('pushBroadcast', pushBroadcast)
          ..add('pushDailySummary', pushDailySummary)
          ..add('pushMarketNews', pushMarketNews)
          ..add('pushCalendarEvents', pushCalendarEvents)
          ..add('pushPriceAnomaly', pushPriceAnomaly)
          ..add('pushWeeklyRecap', pushWeeklyRecap)
          ..add('pushSignalFlip', pushSignalFlip)
          ..add('marketOpenSessions', marketOpenSessions)
          ..add('pushDormancyNudge', pushDormancyNudge)
          ..add('pushOnboarding', pushOnboarding)
          ..add('disengageNoticeCategory', disengageNoticeCategory)
          ..add('guardrailRevenge', guardrailRevenge)
          ..add('guardrailOvertrading', guardrailOvertrading)
          ..add('guardrailHighRisk', guardrailHighRisk)
          ..add('coolingOffEnabled', coolingOffEnabled))
        .toString();
  }
}

class PushPrefsBuilder implements Builder<PushPrefs, PushPrefsBuilder> {
  _$PushPrefs? _$v;

  bool? _pushExpiry;
  bool? get pushExpiry => _$this._pushExpiry;
  set pushExpiry(bool? pushExpiry) => _$this._pushExpiry = pushExpiry;

  bool? _pushBroadcast;
  bool? get pushBroadcast => _$this._pushBroadcast;
  set pushBroadcast(bool? pushBroadcast) =>
      _$this._pushBroadcast = pushBroadcast;

  bool? _pushDailySummary;
  bool? get pushDailySummary => _$this._pushDailySummary;
  set pushDailySummary(bool? pushDailySummary) =>
      _$this._pushDailySummary = pushDailySummary;

  bool? _pushMarketNews;
  bool? get pushMarketNews => _$this._pushMarketNews;
  set pushMarketNews(bool? pushMarketNews) =>
      _$this._pushMarketNews = pushMarketNews;

  bool? _pushCalendarEvents;
  bool? get pushCalendarEvents => _$this._pushCalendarEvents;
  set pushCalendarEvents(bool? pushCalendarEvents) =>
      _$this._pushCalendarEvents = pushCalendarEvents;

  bool? _pushPriceAnomaly;
  bool? get pushPriceAnomaly => _$this._pushPriceAnomaly;
  set pushPriceAnomaly(bool? pushPriceAnomaly) =>
      _$this._pushPriceAnomaly = pushPriceAnomaly;

  bool? _pushWeeklyRecap;
  bool? get pushWeeklyRecap => _$this._pushWeeklyRecap;
  set pushWeeklyRecap(bool? pushWeeklyRecap) =>
      _$this._pushWeeklyRecap = pushWeeklyRecap;

  bool? _pushSignalFlip;
  bool? get pushSignalFlip => _$this._pushSignalFlip;
  set pushSignalFlip(bool? pushSignalFlip) =>
      _$this._pushSignalFlip = pushSignalFlip;

  ListBuilder<PushPrefsMarketOpenSessionsEnum>? _marketOpenSessions;
  ListBuilder<PushPrefsMarketOpenSessionsEnum> get marketOpenSessions =>
      _$this._marketOpenSessions ??=
          ListBuilder<PushPrefsMarketOpenSessionsEnum>();
  set marketOpenSessions(
          ListBuilder<PushPrefsMarketOpenSessionsEnum>? marketOpenSessions) =>
      _$this._marketOpenSessions = marketOpenSessions;

  bool? _pushDormancyNudge;
  bool? get pushDormancyNudge => _$this._pushDormancyNudge;
  set pushDormancyNudge(bool? pushDormancyNudge) =>
      _$this._pushDormancyNudge = pushDormancyNudge;

  bool? _pushOnboarding;
  bool? get pushOnboarding => _$this._pushOnboarding;
  set pushOnboarding(bool? pushOnboarding) =>
      _$this._pushOnboarding = pushOnboarding;

  String? _disengageNoticeCategory;
  String? get disengageNoticeCategory => _$this._disengageNoticeCategory;
  set disengageNoticeCategory(String? disengageNoticeCategory) =>
      _$this._disengageNoticeCategory = disengageNoticeCategory;

  bool? _guardrailRevenge;
  bool? get guardrailRevenge => _$this._guardrailRevenge;
  set guardrailRevenge(bool? guardrailRevenge) =>
      _$this._guardrailRevenge = guardrailRevenge;

  bool? _guardrailOvertrading;
  bool? get guardrailOvertrading => _$this._guardrailOvertrading;
  set guardrailOvertrading(bool? guardrailOvertrading) =>
      _$this._guardrailOvertrading = guardrailOvertrading;

  bool? _guardrailHighRisk;
  bool? get guardrailHighRisk => _$this._guardrailHighRisk;
  set guardrailHighRisk(bool? guardrailHighRisk) =>
      _$this._guardrailHighRisk = guardrailHighRisk;

  bool? _coolingOffEnabled;
  bool? get coolingOffEnabled => _$this._coolingOffEnabled;
  set coolingOffEnabled(bool? coolingOffEnabled) =>
      _$this._coolingOffEnabled = coolingOffEnabled;

  PushPrefsBuilder() {
    PushPrefs._defaults(this);
  }

  PushPrefsBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _pushExpiry = $v.pushExpiry;
      _pushBroadcast = $v.pushBroadcast;
      _pushDailySummary = $v.pushDailySummary;
      _pushMarketNews = $v.pushMarketNews;
      _pushCalendarEvents = $v.pushCalendarEvents;
      _pushPriceAnomaly = $v.pushPriceAnomaly;
      _pushWeeklyRecap = $v.pushWeeklyRecap;
      _pushSignalFlip = $v.pushSignalFlip;
      _marketOpenSessions = $v.marketOpenSessions.toBuilder();
      _pushDormancyNudge = $v.pushDormancyNudge;
      _pushOnboarding = $v.pushOnboarding;
      _disengageNoticeCategory = $v.disengageNoticeCategory;
      _guardrailRevenge = $v.guardrailRevenge;
      _guardrailOvertrading = $v.guardrailOvertrading;
      _guardrailHighRisk = $v.guardrailHighRisk;
      _coolingOffEnabled = $v.coolingOffEnabled;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(PushPrefs other) {
    _$v = other as _$PushPrefs;
  }

  @override
  void update(void Function(PushPrefsBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PushPrefs build() => _build();

  _$PushPrefs _build() {
    _$PushPrefs _$result;
    try {
      _$result = _$v ??
          _$PushPrefs._(
            pushExpiry: BuiltValueNullFieldError.checkNotNull(
                pushExpiry, r'PushPrefs', 'pushExpiry'),
            pushBroadcast: BuiltValueNullFieldError.checkNotNull(
                pushBroadcast, r'PushPrefs', 'pushBroadcast'),
            pushDailySummary: BuiltValueNullFieldError.checkNotNull(
                pushDailySummary, r'PushPrefs', 'pushDailySummary'),
            pushMarketNews: BuiltValueNullFieldError.checkNotNull(
                pushMarketNews, r'PushPrefs', 'pushMarketNews'),
            pushCalendarEvents: BuiltValueNullFieldError.checkNotNull(
                pushCalendarEvents, r'PushPrefs', 'pushCalendarEvents'),
            pushPriceAnomaly: BuiltValueNullFieldError.checkNotNull(
                pushPriceAnomaly, r'PushPrefs', 'pushPriceAnomaly'),
            pushWeeklyRecap: BuiltValueNullFieldError.checkNotNull(
                pushWeeklyRecap, r'PushPrefs', 'pushWeeklyRecap'),
            pushSignalFlip: BuiltValueNullFieldError.checkNotNull(
                pushSignalFlip, r'PushPrefs', 'pushSignalFlip'),
            marketOpenSessions: marketOpenSessions.build(),
            pushDormancyNudge: BuiltValueNullFieldError.checkNotNull(
                pushDormancyNudge, r'PushPrefs', 'pushDormancyNudge'),
            pushOnboarding: BuiltValueNullFieldError.checkNotNull(
                pushOnboarding, r'PushPrefs', 'pushOnboarding'),
            disengageNoticeCategory: disengageNoticeCategory,
            guardrailRevenge: BuiltValueNullFieldError.checkNotNull(
                guardrailRevenge, r'PushPrefs', 'guardrailRevenge'),
            guardrailOvertrading: BuiltValueNullFieldError.checkNotNull(
                guardrailOvertrading, r'PushPrefs', 'guardrailOvertrading'),
            guardrailHighRisk: BuiltValueNullFieldError.checkNotNull(
                guardrailHighRisk, r'PushPrefs', 'guardrailHighRisk'),
            coolingOffEnabled: BuiltValueNullFieldError.checkNotNull(
                coolingOffEnabled, r'PushPrefs', 'coolingOffEnabled'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'marketOpenSessions';
        marketOpenSessions.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'PushPrefs', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
