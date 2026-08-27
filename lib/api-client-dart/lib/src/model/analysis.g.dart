// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analysis.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const AnalysisModeEnum _$analysisModeEnum_beginner =
    const AnalysisModeEnum._('beginner');
const AnalysisModeEnum _$analysisModeEnum_pro = const AnalysisModeEnum._('pro');

AnalysisModeEnum _$analysisModeEnumValueOf(String name) {
  switch (name) {
    case 'beginner':
      return _$analysisModeEnum_beginner;
    case 'pro':
      return _$analysisModeEnum_pro;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<AnalysisModeEnum> _$analysisModeEnumValues =
    BuiltSet<AnalysisModeEnum>(const <AnalysisModeEnum>[
  _$analysisModeEnum_beginner,
  _$analysisModeEnum_pro,
]);

const AnalysisOutcomeStatusEnum _$analysisOutcomeStatusEnum_pending =
    const AnalysisOutcomeStatusEnum._('pending');
const AnalysisOutcomeStatusEnum _$analysisOutcomeStatusEnum_tp1Hit =
    const AnalysisOutcomeStatusEnum._('tp1Hit');
const AnalysisOutcomeStatusEnum _$analysisOutcomeStatusEnum_tp2Hit =
    const AnalysisOutcomeStatusEnum._('tp2Hit');
const AnalysisOutcomeStatusEnum _$analysisOutcomeStatusEnum_slHit =
    const AnalysisOutcomeStatusEnum._('slHit');
const AnalysisOutcomeStatusEnum _$analysisOutcomeStatusEnum_expired =
    const AnalysisOutcomeStatusEnum._('expired');
const AnalysisOutcomeStatusEnum _$analysisOutcomeStatusEnum_invalidated =
    const AnalysisOutcomeStatusEnum._('invalidated');

AnalysisOutcomeStatusEnum _$analysisOutcomeStatusEnumValueOf(String name) {
  switch (name) {
    case 'pending':
      return _$analysisOutcomeStatusEnum_pending;
    case 'tp1Hit':
      return _$analysisOutcomeStatusEnum_tp1Hit;
    case 'tp2Hit':
      return _$analysisOutcomeStatusEnum_tp2Hit;
    case 'slHit':
      return _$analysisOutcomeStatusEnum_slHit;
    case 'expired':
      return _$analysisOutcomeStatusEnum_expired;
    case 'invalidated':
      return _$analysisOutcomeStatusEnum_invalidated;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<AnalysisOutcomeStatusEnum> _$analysisOutcomeStatusEnumValues =
    BuiltSet<AnalysisOutcomeStatusEnum>(const <AnalysisOutcomeStatusEnum>[
  _$analysisOutcomeStatusEnum_pending,
  _$analysisOutcomeStatusEnum_tp1Hit,
  _$analysisOutcomeStatusEnum_tp2Hit,
  _$analysisOutcomeStatusEnum_slHit,
  _$analysisOutcomeStatusEnum_expired,
  _$analysisOutcomeStatusEnum_invalidated,
]);

Serializer<AnalysisModeEnum> _$analysisModeEnumSerializer =
    _$AnalysisModeEnumSerializer();
Serializer<AnalysisOutcomeStatusEnum> _$analysisOutcomeStatusEnumSerializer =
    _$AnalysisOutcomeStatusEnumSerializer();

class _$AnalysisModeEnumSerializer
    implements PrimitiveSerializer<AnalysisModeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'beginner': 'beginner',
    'pro': 'pro',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'beginner': 'beginner',
    'pro': 'pro',
  };

  @override
  final Iterable<Type> types = const <Type>[AnalysisModeEnum];
  @override
  final String wireName = 'AnalysisModeEnum';

  @override
  Object serialize(Serializers serializers, AnalysisModeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  AnalysisModeEnum deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      AnalysisModeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$AnalysisOutcomeStatusEnumSerializer
    implements PrimitiveSerializer<AnalysisOutcomeStatusEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'pending': 'pending',
    'tp1Hit': 'tp1_hit',
    'tp2Hit': 'tp2_hit',
    'slHit': 'sl_hit',
    'expired': 'expired',
    'invalidated': 'invalidated',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'pending': 'pending',
    'tp1_hit': 'tp1Hit',
    'tp2_hit': 'tp2Hit',
    'sl_hit': 'slHit',
    'expired': 'expired',
    'invalidated': 'invalidated',
  };

  @override
  final Iterable<Type> types = const <Type>[AnalysisOutcomeStatusEnum];
  @override
  final String wireName = 'AnalysisOutcomeStatusEnum';

  @override
  Object serialize(Serializers serializers, AnalysisOutcomeStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  AnalysisOutcomeStatusEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      AnalysisOutcomeStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$Analysis extends Analysis {
  @override
  final int id;
  @override
  final int userId;
  @override
  final String instrument;
  @override
  final String timeframe;
  @override
  final String? userInputContext;
  @override
  final AnalysisModeEnum mode;
  @override
  final DateTime validUntil;
  @override
  final String? marketCondition;
  @override
  final String? riskLevel;
  @override
  final int? confidenceMin;
  @override
  final int? confidenceMax;
  @override
  final String? mainScenario;
  @override
  final String? alternativeScenario;
  @override
  final String? whyReason;
  @override
  final String? failureConditions;
  @override
  final String? baseCase;
  @override
  final String? bullishScenario;
  @override
  final String? bearishScenario;
  @override
  final String? keyDriversTechnical;
  @override
  final String? keyDriversFundamental;
  @override
  final String? marketContext;
  @override
  final String? invalidationConditions;
  @override
  final String? uncertaintyNotes;
  @override
  final String? tradingBias;
  @override
  final String? opportunity;
  @override
  final String? risk;
  @override
  final int? techBuyCount;
  @override
  final int? techSellCount;
  @override
  final int? techNeutralCount;
  @override
  final TradePlan? tradePlan;
  @override
  final FundamentalContext? fundamentalContext;
  @override
  final FundamentalCitations? fundamentalCitations;
  @override
  final AnalysisOutcomeStatusEnum? outcomeStatus;
  @override
  final DateTime? outcomeResolvedAt;
  @override
  final DateTime? outcomeCheckedAt;
  @override
  final String? userNote;
  @override
  final DateTime? userNoteUpdatedAt;
  @override
  final bool? hasNote;
  @override
  final Feedback? feedback;
  @override
  final int? usefulCount;
  @override
  final int? notUsefulCount;
  @override
  final DateTime createdAt;

  factory _$Analysis([void Function(AnalysisBuilder)? updates]) =>
      (AnalysisBuilder()..update(updates))._build();

  _$Analysis._(
      {required this.id,
      required this.userId,
      required this.instrument,
      required this.timeframe,
      this.userInputContext,
      required this.mode,
      required this.validUntil,
      this.marketCondition,
      this.riskLevel,
      this.confidenceMin,
      this.confidenceMax,
      this.mainScenario,
      this.alternativeScenario,
      this.whyReason,
      this.failureConditions,
      this.baseCase,
      this.bullishScenario,
      this.bearishScenario,
      this.keyDriversTechnical,
      this.keyDriversFundamental,
      this.marketContext,
      this.invalidationConditions,
      this.uncertaintyNotes,
      this.tradingBias,
      this.opportunity,
      this.risk,
      this.techBuyCount,
      this.techSellCount,
      this.techNeutralCount,
      this.tradePlan,
      this.fundamentalContext,
      this.fundamentalCitations,
      this.outcomeStatus,
      this.outcomeResolvedAt,
      this.outcomeCheckedAt,
      this.userNote,
      this.userNoteUpdatedAt,
      this.hasNote,
      this.feedback,
      this.usefulCount,
      this.notUsefulCount,
      required this.createdAt})
      : super._();
  @override
  Analysis rebuild(void Function(AnalysisBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalysisBuilder toBuilder() => AnalysisBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Analysis &&
        id == other.id &&
        userId == other.userId &&
        instrument == other.instrument &&
        timeframe == other.timeframe &&
        userInputContext == other.userInputContext &&
        mode == other.mode &&
        validUntil == other.validUntil &&
        marketCondition == other.marketCondition &&
        riskLevel == other.riskLevel &&
        confidenceMin == other.confidenceMin &&
        confidenceMax == other.confidenceMax &&
        mainScenario == other.mainScenario &&
        alternativeScenario == other.alternativeScenario &&
        whyReason == other.whyReason &&
        failureConditions == other.failureConditions &&
        baseCase == other.baseCase &&
        bullishScenario == other.bullishScenario &&
        bearishScenario == other.bearishScenario &&
        keyDriversTechnical == other.keyDriversTechnical &&
        keyDriversFundamental == other.keyDriversFundamental &&
        marketContext == other.marketContext &&
        invalidationConditions == other.invalidationConditions &&
        uncertaintyNotes == other.uncertaintyNotes &&
        tradingBias == other.tradingBias &&
        opportunity == other.opportunity &&
        risk == other.risk &&
        techBuyCount == other.techBuyCount &&
        techSellCount == other.techSellCount &&
        techNeutralCount == other.techNeutralCount &&
        tradePlan == other.tradePlan &&
        fundamentalContext == other.fundamentalContext &&
        fundamentalCitations == other.fundamentalCitations &&
        outcomeStatus == other.outcomeStatus &&
        outcomeResolvedAt == other.outcomeResolvedAt &&
        outcomeCheckedAt == other.outcomeCheckedAt &&
        userNote == other.userNote &&
        userNoteUpdatedAt == other.userNoteUpdatedAt &&
        hasNote == other.hasNote &&
        feedback == other.feedback &&
        usefulCount == other.usefulCount &&
        notUsefulCount == other.notUsefulCount &&
        createdAt == other.createdAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, userId.hashCode);
    _$hash = $jc(_$hash, instrument.hashCode);
    _$hash = $jc(_$hash, timeframe.hashCode);
    _$hash = $jc(_$hash, userInputContext.hashCode);
    _$hash = $jc(_$hash, mode.hashCode);
    _$hash = $jc(_$hash, validUntil.hashCode);
    _$hash = $jc(_$hash, marketCondition.hashCode);
    _$hash = $jc(_$hash, riskLevel.hashCode);
    _$hash = $jc(_$hash, confidenceMin.hashCode);
    _$hash = $jc(_$hash, confidenceMax.hashCode);
    _$hash = $jc(_$hash, mainScenario.hashCode);
    _$hash = $jc(_$hash, alternativeScenario.hashCode);
    _$hash = $jc(_$hash, whyReason.hashCode);
    _$hash = $jc(_$hash, failureConditions.hashCode);
    _$hash = $jc(_$hash, baseCase.hashCode);
    _$hash = $jc(_$hash, bullishScenario.hashCode);
    _$hash = $jc(_$hash, bearishScenario.hashCode);
    _$hash = $jc(_$hash, keyDriversTechnical.hashCode);
    _$hash = $jc(_$hash, keyDriversFundamental.hashCode);
    _$hash = $jc(_$hash, marketContext.hashCode);
    _$hash = $jc(_$hash, invalidationConditions.hashCode);
    _$hash = $jc(_$hash, uncertaintyNotes.hashCode);
    _$hash = $jc(_$hash, tradingBias.hashCode);
    _$hash = $jc(_$hash, opportunity.hashCode);
    _$hash = $jc(_$hash, risk.hashCode);
    _$hash = $jc(_$hash, techBuyCount.hashCode);
    _$hash = $jc(_$hash, techSellCount.hashCode);
    _$hash = $jc(_$hash, techNeutralCount.hashCode);
    _$hash = $jc(_$hash, tradePlan.hashCode);
    _$hash = $jc(_$hash, fundamentalContext.hashCode);
    _$hash = $jc(_$hash, fundamentalCitations.hashCode);
    _$hash = $jc(_$hash, outcomeStatus.hashCode);
    _$hash = $jc(_$hash, outcomeResolvedAt.hashCode);
    _$hash = $jc(_$hash, outcomeCheckedAt.hashCode);
    _$hash = $jc(_$hash, userNote.hashCode);
    _$hash = $jc(_$hash, userNoteUpdatedAt.hashCode);
    _$hash = $jc(_$hash, hasNote.hashCode);
    _$hash = $jc(_$hash, feedback.hashCode);
    _$hash = $jc(_$hash, usefulCount.hashCode);
    _$hash = $jc(_$hash, notUsefulCount.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'Analysis')
          ..add('id', id)
          ..add('userId', userId)
          ..add('instrument', instrument)
          ..add('timeframe', timeframe)
          ..add('userInputContext', userInputContext)
          ..add('mode', mode)
          ..add('validUntil', validUntil)
          ..add('marketCondition', marketCondition)
          ..add('riskLevel', riskLevel)
          ..add('confidenceMin', confidenceMin)
          ..add('confidenceMax', confidenceMax)
          ..add('mainScenario', mainScenario)
          ..add('alternativeScenario', alternativeScenario)
          ..add('whyReason', whyReason)
          ..add('failureConditions', failureConditions)
          ..add('baseCase', baseCase)
          ..add('bullishScenario', bullishScenario)
          ..add('bearishScenario', bearishScenario)
          ..add('keyDriversTechnical', keyDriversTechnical)
          ..add('keyDriversFundamental', keyDriversFundamental)
          ..add('marketContext', marketContext)
          ..add('invalidationConditions', invalidationConditions)
          ..add('uncertaintyNotes', uncertaintyNotes)
          ..add('tradingBias', tradingBias)
          ..add('opportunity', opportunity)
          ..add('risk', risk)
          ..add('techBuyCount', techBuyCount)
          ..add('techSellCount', techSellCount)
          ..add('techNeutralCount', techNeutralCount)
          ..add('tradePlan', tradePlan)
          ..add('fundamentalContext', fundamentalContext)
          ..add('fundamentalCitations', fundamentalCitations)
          ..add('outcomeStatus', outcomeStatus)
          ..add('outcomeResolvedAt', outcomeResolvedAt)
          ..add('outcomeCheckedAt', outcomeCheckedAt)
          ..add('userNote', userNote)
          ..add('userNoteUpdatedAt', userNoteUpdatedAt)
          ..add('hasNote', hasNote)
          ..add('feedback', feedback)
          ..add('usefulCount', usefulCount)
          ..add('notUsefulCount', notUsefulCount)
          ..add('createdAt', createdAt))
        .toString();
  }
}

class AnalysisBuilder implements Builder<Analysis, AnalysisBuilder> {
  _$Analysis? _$v;

  int? _id;
  int? get id => _$this._id;
  set id(int? id) => _$this._id = id;

  int? _userId;
  int? get userId => _$this._userId;
  set userId(int? userId) => _$this._userId = userId;

  String? _instrument;
  String? get instrument => _$this._instrument;
  set instrument(String? instrument) => _$this._instrument = instrument;

  String? _timeframe;
  String? get timeframe => _$this._timeframe;
  set timeframe(String? timeframe) => _$this._timeframe = timeframe;

  String? _userInputContext;
  String? get userInputContext => _$this._userInputContext;
  set userInputContext(String? userInputContext) =>
      _$this._userInputContext = userInputContext;

  AnalysisModeEnum? _mode;
  AnalysisModeEnum? get mode => _$this._mode;
  set mode(AnalysisModeEnum? mode) => _$this._mode = mode;

  DateTime? _validUntil;
  DateTime? get validUntil => _$this._validUntil;
  set validUntil(DateTime? validUntil) => _$this._validUntil = validUntil;

  String? _marketCondition;
  String? get marketCondition => _$this._marketCondition;
  set marketCondition(String? marketCondition) =>
      _$this._marketCondition = marketCondition;

  String? _riskLevel;
  String? get riskLevel => _$this._riskLevel;
  set riskLevel(String? riskLevel) => _$this._riskLevel = riskLevel;

  int? _confidenceMin;
  int? get confidenceMin => _$this._confidenceMin;
  set confidenceMin(int? confidenceMin) =>
      _$this._confidenceMin = confidenceMin;

  int? _confidenceMax;
  int? get confidenceMax => _$this._confidenceMax;
  set confidenceMax(int? confidenceMax) =>
      _$this._confidenceMax = confidenceMax;

  String? _mainScenario;
  String? get mainScenario => _$this._mainScenario;
  set mainScenario(String? mainScenario) => _$this._mainScenario = mainScenario;

  String? _alternativeScenario;
  String? get alternativeScenario => _$this._alternativeScenario;
  set alternativeScenario(String? alternativeScenario) =>
      _$this._alternativeScenario = alternativeScenario;

  String? _whyReason;
  String? get whyReason => _$this._whyReason;
  set whyReason(String? whyReason) => _$this._whyReason = whyReason;

  String? _failureConditions;
  String? get failureConditions => _$this._failureConditions;
  set failureConditions(String? failureConditions) =>
      _$this._failureConditions = failureConditions;

  String? _baseCase;
  String? get baseCase => _$this._baseCase;
  set baseCase(String? baseCase) => _$this._baseCase = baseCase;

  String? _bullishScenario;
  String? get bullishScenario => _$this._bullishScenario;
  set bullishScenario(String? bullishScenario) =>
      _$this._bullishScenario = bullishScenario;

  String? _bearishScenario;
  String? get bearishScenario => _$this._bearishScenario;
  set bearishScenario(String? bearishScenario) =>
      _$this._bearishScenario = bearishScenario;

  String? _keyDriversTechnical;
  String? get keyDriversTechnical => _$this._keyDriversTechnical;
  set keyDriversTechnical(String? keyDriversTechnical) =>
      _$this._keyDriversTechnical = keyDriversTechnical;

  String? _keyDriversFundamental;
  String? get keyDriversFundamental => _$this._keyDriversFundamental;
  set keyDriversFundamental(String? keyDriversFundamental) =>
      _$this._keyDriversFundamental = keyDriversFundamental;

  String? _marketContext;
  String? get marketContext => _$this._marketContext;
  set marketContext(String? marketContext) =>
      _$this._marketContext = marketContext;

  String? _invalidationConditions;
  String? get invalidationConditions => _$this._invalidationConditions;
  set invalidationConditions(String? invalidationConditions) =>
      _$this._invalidationConditions = invalidationConditions;

  String? _uncertaintyNotes;
  String? get uncertaintyNotes => _$this._uncertaintyNotes;
  set uncertaintyNotes(String? uncertaintyNotes) =>
      _$this._uncertaintyNotes = uncertaintyNotes;

  String? _tradingBias;
  String? get tradingBias => _$this._tradingBias;
  set tradingBias(String? tradingBias) => _$this._tradingBias = tradingBias;

  String? _opportunity;
  String? get opportunity => _$this._opportunity;
  set opportunity(String? opportunity) => _$this._opportunity = opportunity;

  String? _risk;
  String? get risk => _$this._risk;
  set risk(String? risk) => _$this._risk = risk;

  int? _techBuyCount;
  int? get techBuyCount => _$this._techBuyCount;
  set techBuyCount(int? techBuyCount) => _$this._techBuyCount = techBuyCount;

  int? _techSellCount;
  int? get techSellCount => _$this._techSellCount;
  set techSellCount(int? techSellCount) =>
      _$this._techSellCount = techSellCount;

  int? _techNeutralCount;
  int? get techNeutralCount => _$this._techNeutralCount;
  set techNeutralCount(int? techNeutralCount) =>
      _$this._techNeutralCount = techNeutralCount;

  TradePlanBuilder? _tradePlan;
  TradePlanBuilder get tradePlan => _$this._tradePlan ??= TradePlanBuilder();
  set tradePlan(TradePlanBuilder? tradePlan) => _$this._tradePlan = tradePlan;

  FundamentalContextBuilder? _fundamentalContext;
  FundamentalContextBuilder get fundamentalContext =>
      _$this._fundamentalContext ??= FundamentalContextBuilder();
  set fundamentalContext(FundamentalContextBuilder? fundamentalContext) =>
      _$this._fundamentalContext = fundamentalContext;

  FundamentalCitationsBuilder? _fundamentalCitations;
  FundamentalCitationsBuilder get fundamentalCitations =>
      _$this._fundamentalCitations ??= FundamentalCitationsBuilder();
  set fundamentalCitations(FundamentalCitationsBuilder? fundamentalCitations) =>
      _$this._fundamentalCitations = fundamentalCitations;

  AnalysisOutcomeStatusEnum? _outcomeStatus;
  AnalysisOutcomeStatusEnum? get outcomeStatus => _$this._outcomeStatus;
  set outcomeStatus(AnalysisOutcomeStatusEnum? outcomeStatus) =>
      _$this._outcomeStatus = outcomeStatus;

  DateTime? _outcomeResolvedAt;
  DateTime? get outcomeResolvedAt => _$this._outcomeResolvedAt;
  set outcomeResolvedAt(DateTime? outcomeResolvedAt) =>
      _$this._outcomeResolvedAt = outcomeResolvedAt;

  DateTime? _outcomeCheckedAt;
  DateTime? get outcomeCheckedAt => _$this._outcomeCheckedAt;
  set outcomeCheckedAt(DateTime? outcomeCheckedAt) =>
      _$this._outcomeCheckedAt = outcomeCheckedAt;

  String? _userNote;
  String? get userNote => _$this._userNote;
  set userNote(String? userNote) => _$this._userNote = userNote;

  DateTime? _userNoteUpdatedAt;
  DateTime? get userNoteUpdatedAt => _$this._userNoteUpdatedAt;
  set userNoteUpdatedAt(DateTime? userNoteUpdatedAt) =>
      _$this._userNoteUpdatedAt = userNoteUpdatedAt;

  bool? _hasNote;
  bool? get hasNote => _$this._hasNote;
  set hasNote(bool? hasNote) => _$this._hasNote = hasNote;

  FeedbackBuilder? _feedback;
  FeedbackBuilder get feedback => _$this._feedback ??= FeedbackBuilder();
  set feedback(FeedbackBuilder? feedback) => _$this._feedback = feedback;

  int? _usefulCount;
  int? get usefulCount => _$this._usefulCount;
  set usefulCount(int? usefulCount) => _$this._usefulCount = usefulCount;

  int? _notUsefulCount;
  int? get notUsefulCount => _$this._notUsefulCount;
  set notUsefulCount(int? notUsefulCount) =>
      _$this._notUsefulCount = notUsefulCount;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  AnalysisBuilder() {
    Analysis._defaults(this);
  }

  AnalysisBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _userId = $v.userId;
      _instrument = $v.instrument;
      _timeframe = $v.timeframe;
      _userInputContext = $v.userInputContext;
      _mode = $v.mode;
      _validUntil = $v.validUntil;
      _marketCondition = $v.marketCondition;
      _riskLevel = $v.riskLevel;
      _confidenceMin = $v.confidenceMin;
      _confidenceMax = $v.confidenceMax;
      _mainScenario = $v.mainScenario;
      _alternativeScenario = $v.alternativeScenario;
      _whyReason = $v.whyReason;
      _failureConditions = $v.failureConditions;
      _baseCase = $v.baseCase;
      _bullishScenario = $v.bullishScenario;
      _bearishScenario = $v.bearishScenario;
      _keyDriversTechnical = $v.keyDriversTechnical;
      _keyDriversFundamental = $v.keyDriversFundamental;
      _marketContext = $v.marketContext;
      _invalidationConditions = $v.invalidationConditions;
      _uncertaintyNotes = $v.uncertaintyNotes;
      _tradingBias = $v.tradingBias;
      _opportunity = $v.opportunity;
      _risk = $v.risk;
      _techBuyCount = $v.techBuyCount;
      _techSellCount = $v.techSellCount;
      _techNeutralCount = $v.techNeutralCount;
      _tradePlan = $v.tradePlan?.toBuilder();
      _fundamentalContext = $v.fundamentalContext?.toBuilder();
      _fundamentalCitations = $v.fundamentalCitations?.toBuilder();
      _outcomeStatus = $v.outcomeStatus;
      _outcomeResolvedAt = $v.outcomeResolvedAt;
      _outcomeCheckedAt = $v.outcomeCheckedAt;
      _userNote = $v.userNote;
      _userNoteUpdatedAt = $v.userNoteUpdatedAt;
      _hasNote = $v.hasNote;
      _feedback = $v.feedback?.toBuilder();
      _usefulCount = $v.usefulCount;
      _notUsefulCount = $v.notUsefulCount;
      _createdAt = $v.createdAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(Analysis other) {
    _$v = other as _$Analysis;
  }

  @override
  void update(void Function(AnalysisBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  Analysis build() => _build();

  _$Analysis _build() {
    _$Analysis _$result;
    try {
      _$result = _$v ??
          _$Analysis._(
            id: BuiltValueNullFieldError.checkNotNull(id, r'Analysis', 'id'),
            userId: BuiltValueNullFieldError.checkNotNull(
                userId, r'Analysis', 'userId'),
            instrument: BuiltValueNullFieldError.checkNotNull(
                instrument, r'Analysis', 'instrument'),
            timeframe: BuiltValueNullFieldError.checkNotNull(
                timeframe, r'Analysis', 'timeframe'),
            userInputContext: userInputContext,
            mode: BuiltValueNullFieldError.checkNotNull(
                mode, r'Analysis', 'mode'),
            validUntil: BuiltValueNullFieldError.checkNotNull(
                validUntil, r'Analysis', 'validUntil'),
            marketCondition: marketCondition,
            riskLevel: riskLevel,
            confidenceMin: confidenceMin,
            confidenceMax: confidenceMax,
            mainScenario: mainScenario,
            alternativeScenario: alternativeScenario,
            whyReason: whyReason,
            failureConditions: failureConditions,
            baseCase: baseCase,
            bullishScenario: bullishScenario,
            bearishScenario: bearishScenario,
            keyDriversTechnical: keyDriversTechnical,
            keyDriversFundamental: keyDriversFundamental,
            marketContext: marketContext,
            invalidationConditions: invalidationConditions,
            uncertaintyNotes: uncertaintyNotes,
            tradingBias: tradingBias,
            opportunity: opportunity,
            risk: risk,
            techBuyCount: techBuyCount,
            techSellCount: techSellCount,
            techNeutralCount: techNeutralCount,
            tradePlan: _tradePlan?.build(),
            fundamentalContext: _fundamentalContext?.build(),
            fundamentalCitations: _fundamentalCitations?.build(),
            outcomeStatus: outcomeStatus,
            outcomeResolvedAt: outcomeResolvedAt,
            outcomeCheckedAt: outcomeCheckedAt,
            userNote: userNote,
            userNoteUpdatedAt: userNoteUpdatedAt,
            hasNote: hasNote,
            feedback: _feedback?.build(),
            usefulCount: usefulCount,
            notUsefulCount: notUsefulCount,
            createdAt: BuiltValueNullFieldError.checkNotNull(
                createdAt, r'Analysis', 'createdAt'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'tradePlan';
        _tradePlan?.build();
        _$failedField = 'fundamentalContext';
        _fundamentalContext?.build();
        _$failedField = 'fundamentalCitations';
        _fundamentalCitations?.build();

        _$failedField = 'feedback';
        _feedback?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'Analysis', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
