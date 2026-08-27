// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'push_prefs_update.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const PushPrefsUpdateMarketOpenSessionsEnum
    _$pushPrefsUpdateMarketOpenSessionsEnum_tokyo =
    const PushPrefsUpdateMarketOpenSessionsEnum._('tokyo');
const PushPrefsUpdateMarketOpenSessionsEnum
    _$pushPrefsUpdateMarketOpenSessionsEnum_london =
    const PushPrefsUpdateMarketOpenSessionsEnum._('london');
const PushPrefsUpdateMarketOpenSessionsEnum
    _$pushPrefsUpdateMarketOpenSessionsEnum_newyork =
    const PushPrefsUpdateMarketOpenSessionsEnum._('newyork');

PushPrefsUpdateMarketOpenSessionsEnum
    _$pushPrefsUpdateMarketOpenSessionsEnumValueOf(String name) {
  switch (name) {
    case 'tokyo':
      return _$pushPrefsUpdateMarketOpenSessionsEnum_tokyo;
    case 'london':
      return _$pushPrefsUpdateMarketOpenSessionsEnum_london;
    case 'newyork':
      return _$pushPrefsUpdateMarketOpenSessionsEnum_newyork;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<PushPrefsUpdateMarketOpenSessionsEnum>
    _$pushPrefsUpdateMarketOpenSessionsEnumValues = BuiltSet<
        PushPrefsUpdateMarketOpenSessionsEnum>(const <PushPrefsUpdateMarketOpenSessionsEnum>[
  _$pushPrefsUpdateMarketOpenSessionsEnum_tokyo,
  _$pushPrefsUpdateMarketOpenSessionsEnum_london,
  _$pushPrefsUpdateMarketOpenSessionsEnum_newyork,
]);

Serializer<PushPrefsUpdateMarketOpenSessionsEnum>
    _$pushPrefsUpdateMarketOpenSessionsEnumSerializer =
    _$PushPrefsUpdateMarketOpenSessionsEnumSerializer();

class _$PushPrefsUpdateMarketOpenSessionsEnumSerializer
    implements PrimitiveSerializer<PushPrefsUpdateMarketOpenSessionsEnum> {
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
  final Iterable<Type> types = const <Type>[
    PushPrefsUpdateMarketOpenSessionsEnum
  ];
  @override
  final String wireName = 'PushPrefsUpdateMarketOpenSessionsEnum';

  @override
  Object serialize(
          Serializers serializers, PushPrefsUpdateMarketOpenSessionsEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  PushPrefsUpdateMarketOpenSessionsEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      PushPrefsUpdateMarketOpenSessionsEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$PushPrefsUpdate extends PushPrefsUpdate {
  @override
  final bool? pushExpiry;
  @override
  final bool? pushBroadcast;
  @override
  final bool? pushDailySummary;
  @override
  final bool? pushMarketNews;
  @override
  final bool? pushCalendarEvents;
  @override
  final bool? pushPriceAnomaly;
  @override
  final bool? pushWeeklyRecap;
  @override
  final bool? pushSignalFlip;
  @override
  final BuiltList<PushPrefsUpdateMarketOpenSessionsEnum>? marketOpenSessions;
  @override
  final bool? pushDormancyNudge;
  @override
  final bool? pushOnboarding;
  @override
  final bool? dismissDisengageNotice;
  @override
  final bool? guardrailRevenge;
  @override
  final bool? guardrailOvertrading;
  @override
  final bool? guardrailHighRisk;
  @override
  final bool? coolingOffEnabled;

  factory _$PushPrefsUpdate([void Function(PushPrefsUpdateBuilder)? updates]) =>
      (PushPrefsUpdateBuilder()..update(updates))._build();

  _$PushPrefsUpdate._(
      {this.pushExpiry,
      this.pushBroadcast,
      this.pushDailySummary,
      this.pushMarketNews,
      this.pushCalendarEvents,
      this.pushPriceAnomaly,
      this.pushWeeklyRecap,
      this.pushSignalFlip,
      this.marketOpenSessions,
      this.pushDormancyNudge,
      this.pushOnboarding,
      this.dismissDisengageNotice,
      this.guardrailRevenge,
      this.guardrailOvertrading,
      this.guardrailHighRisk,
      this.coolingOffEnabled})
      : super._();
  @override
  PushPrefsUpdate rebuild(void Function(PushPrefsUpdateBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  PushPrefsUpdateBuilder toBuilder() => PushPrefsUpdateBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is PushPrefsUpdate &&
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
        dismissDisengageNotice == other.dismissDisengageNotice &&
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
    _$hash = $jc(_$hash, dismissDisengageNotice.hashCode);
    _$hash = $jc(_$hash, guardrailRevenge.hashCode);
    _$hash = $jc(_$hash, guardrailOvertrading.hashCode);
    _$hash = $jc(_$hash, guardrailHighRisk.hashCode);
    _$hash = $jc(_$hash, coolingOffEnabled.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'PushPrefsUpdate')
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
          ..add('dismissDisengageNotice', dismissDisengageNotice)
          ..add('guardrailRevenge', guardrailRevenge)
          ..add('guardrailOvertrading', guardrailOvertrading)
          ..add('guardrailHighRisk', guardrailHighRisk)
          ..add('coolingOffEnabled', coolingOffEnabled))
        .toString();
  }
}

class PushPrefsUpdateBuilder
    implements Builder<PushPrefsUpdate, PushPrefsUpdateBuilder> {
  _$PushPrefsUpdate? _$v;

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

  ListBuilder<PushPrefsUpdateMarketOpenSessionsEnum>? _marketOpenSessions;
  ListBuilder<PushPrefsUpdateMarketOpenSessionsEnum> get marketOpenSessions =>
      _$this._marketOpenSessions ??=
          ListBuilder<PushPrefsUpdateMarketOpenSessionsEnum>();
  set marketOpenSessions(
          ListBuilder<PushPrefsUpdateMarketOpenSessionsEnum>?
              marketOpenSessions) =>
      _$this._marketOpenSessions = marketOpenSessions;

  bool? _pushDormancyNudge;
  bool? get pushDormancyNudge => _$this._pushDormancyNudge;
  set pushDormancyNudge(bool? pushDormancyNudge) =>
      _$this._pushDormancyNudge = pushDormancyNudge;

  bool? _pushOnboarding;
  bool? get pushOnboarding => _$this._pushOnboarding;
  set pushOnboarding(bool? pushOnboarding) =>
      _$this._pushOnboarding = pushOnboarding;

  bool? _dismissDisengageNotice;
  bool? get dismissDisengageNotice => _$this._dismissDisengageNotice;
  set dismissDisengageNotice(bool? dismissDisengageNotice) =>
      _$this._dismissDisengageNotice = dismissDisengageNotice;

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

  PushPrefsUpdateBuilder() {
    PushPrefsUpdate._defaults(this);
  }

  PushPrefsUpdateBuilder get _$this {
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
      _marketOpenSessions = $v.marketOpenSessions?.toBuilder();
      _pushDormancyNudge = $v.pushDormancyNudge;
      _pushOnboarding = $v.pushOnboarding;
      _dismissDisengageNotice = $v.dismissDisengageNotice;
      _guardrailRevenge = $v.guardrailRevenge;
      _guardrailOvertrading = $v.guardrailOvertrading;
      _guardrailHighRisk = $v.guardrailHighRisk;
      _coolingOffEnabled = $v.coolingOffEnabled;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(PushPrefsUpdate other) {
    _$v = other as _$PushPrefsUpdate;
  }

  @override
  void update(void Function(PushPrefsUpdateBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  PushPrefsUpdate build() => _build();

  _$PushPrefsUpdate _build() {
    _$PushPrefsUpdate _$result;
    try {
      _$result = _$v ??
          _$PushPrefsUpdate._(
            pushExpiry: pushExpiry,
            pushBroadcast: pushBroadcast,
            pushDailySummary: pushDailySummary,
            pushMarketNews: pushMarketNews,
            pushCalendarEvents: pushCalendarEvents,
            pushPriceAnomaly: pushPriceAnomaly,
            pushWeeklyRecap: pushWeeklyRecap,
            pushSignalFlip: pushSignalFlip,
            marketOpenSessions: _marketOpenSessions?.build(),
            pushDormancyNudge: pushDormancyNudge,
            pushOnboarding: pushOnboarding,
            dismissDisengageNotice: dismissDisengageNotice,
            guardrailRevenge: guardrailRevenge,
            guardrailOvertrading: guardrailOvertrading,
            guardrailHighRisk: guardrailHighRisk,
            coolingOffEnabled: coolingOffEnabled,
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'marketOpenSessions';
        _marketOpenSessions?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'PushPrefsUpdate', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
