// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'feedback_with_details.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const FeedbackWithDetailsFeedbackTypeEnum
    _$feedbackWithDetailsFeedbackTypeEnum_useful =
    const FeedbackWithDetailsFeedbackTypeEnum._('useful');
const FeedbackWithDetailsFeedbackTypeEnum
    _$feedbackWithDetailsFeedbackTypeEnum_notUseful =
    const FeedbackWithDetailsFeedbackTypeEnum._('notUseful');

FeedbackWithDetailsFeedbackTypeEnum
    _$feedbackWithDetailsFeedbackTypeEnumValueOf(String name) {
  switch (name) {
    case 'useful':
      return _$feedbackWithDetailsFeedbackTypeEnum_useful;
    case 'notUseful':
      return _$feedbackWithDetailsFeedbackTypeEnum_notUseful;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<FeedbackWithDetailsFeedbackTypeEnum>
    _$feedbackWithDetailsFeedbackTypeEnumValues = BuiltSet<
        FeedbackWithDetailsFeedbackTypeEnum>(const <FeedbackWithDetailsFeedbackTypeEnum>[
  _$feedbackWithDetailsFeedbackTypeEnum_useful,
  _$feedbackWithDetailsFeedbackTypeEnum_notUseful,
]);

const FeedbackWithDetailsOutcomeEnum _$feedbackWithDetailsOutcomeEnum_correct =
    const FeedbackWithDetailsOutcomeEnum._('correct');
const FeedbackWithDetailsOutcomeEnum _$feedbackWithDetailsOutcomeEnum_wrong =
    const FeedbackWithDetailsOutcomeEnum._('wrong');
const FeedbackWithDetailsOutcomeEnum _$feedbackWithDetailsOutcomeEnum_unknown =
    const FeedbackWithDetailsOutcomeEnum._('unknown');

FeedbackWithDetailsOutcomeEnum _$feedbackWithDetailsOutcomeEnumValueOf(
    String name) {
  switch (name) {
    case 'correct':
      return _$feedbackWithDetailsOutcomeEnum_correct;
    case 'wrong':
      return _$feedbackWithDetailsOutcomeEnum_wrong;
    case 'unknown':
      return _$feedbackWithDetailsOutcomeEnum_unknown;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<FeedbackWithDetailsOutcomeEnum>
    _$feedbackWithDetailsOutcomeEnumValues = BuiltSet<
        FeedbackWithDetailsOutcomeEnum>(const <FeedbackWithDetailsOutcomeEnum>[
  _$feedbackWithDetailsOutcomeEnum_correct,
  _$feedbackWithDetailsOutcomeEnum_wrong,
  _$feedbackWithDetailsOutcomeEnum_unknown,
]);

Serializer<FeedbackWithDetailsFeedbackTypeEnum>
    _$feedbackWithDetailsFeedbackTypeEnumSerializer =
    _$FeedbackWithDetailsFeedbackTypeEnumSerializer();
Serializer<FeedbackWithDetailsOutcomeEnum>
    _$feedbackWithDetailsOutcomeEnumSerializer =
    _$FeedbackWithDetailsOutcomeEnumSerializer();

class _$FeedbackWithDetailsFeedbackTypeEnumSerializer
    implements PrimitiveSerializer<FeedbackWithDetailsFeedbackTypeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'useful': 'useful',
    'notUseful': 'not_useful',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'useful': 'useful',
    'not_useful': 'notUseful',
  };

  @override
  final Iterable<Type> types = const <Type>[
    FeedbackWithDetailsFeedbackTypeEnum
  ];
  @override
  final String wireName = 'FeedbackWithDetailsFeedbackTypeEnum';

  @override
  Object serialize(
          Serializers serializers, FeedbackWithDetailsFeedbackTypeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  FeedbackWithDetailsFeedbackTypeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      FeedbackWithDetailsFeedbackTypeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$FeedbackWithDetailsOutcomeEnumSerializer
    implements PrimitiveSerializer<FeedbackWithDetailsOutcomeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'correct': 'correct',
    'wrong': 'wrong',
    'unknown': 'unknown',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'correct': 'correct',
    'wrong': 'wrong',
    'unknown': 'unknown',
  };

  @override
  final Iterable<Type> types = const <Type>[FeedbackWithDetailsOutcomeEnum];
  @override
  final String wireName = 'FeedbackWithDetailsOutcomeEnum';

  @override
  Object serialize(
          Serializers serializers, FeedbackWithDetailsOutcomeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  FeedbackWithDetailsOutcomeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      FeedbackWithDetailsOutcomeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$FeedbackWithDetails extends FeedbackWithDetails {
  @override
  final int id;
  @override
  final int analysisId;
  @override
  final String instrument;
  @override
  final int userId;
  @override
  final String userEmail;
  @override
  final FeedbackWithDetailsFeedbackTypeEnum feedbackType;
  @override
  final FeedbackWithDetailsOutcomeEnum? outcome;
  @override
  final String? note;
  @override
  final DateTime createdAt;

  factory _$FeedbackWithDetails(
          [void Function(FeedbackWithDetailsBuilder)? updates]) =>
      (FeedbackWithDetailsBuilder()..update(updates))._build();

  _$FeedbackWithDetails._(
      {required this.id,
      required this.analysisId,
      required this.instrument,
      required this.userId,
      required this.userEmail,
      required this.feedbackType,
      this.outcome,
      this.note,
      required this.createdAt})
      : super._();
  @override
  FeedbackWithDetails rebuild(
          void Function(FeedbackWithDetailsBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  FeedbackWithDetailsBuilder toBuilder() =>
      FeedbackWithDetailsBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is FeedbackWithDetails &&
        id == other.id &&
        analysisId == other.analysisId &&
        instrument == other.instrument &&
        userId == other.userId &&
        userEmail == other.userEmail &&
        feedbackType == other.feedbackType &&
        outcome == other.outcome &&
        note == other.note &&
        createdAt == other.createdAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, analysisId.hashCode);
    _$hash = $jc(_$hash, instrument.hashCode);
    _$hash = $jc(_$hash, userId.hashCode);
    _$hash = $jc(_$hash, userEmail.hashCode);
    _$hash = $jc(_$hash, feedbackType.hashCode);
    _$hash = $jc(_$hash, outcome.hashCode);
    _$hash = $jc(_$hash, note.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'FeedbackWithDetails')
          ..add('id', id)
          ..add('analysisId', analysisId)
          ..add('instrument', instrument)
          ..add('userId', userId)
          ..add('userEmail', userEmail)
          ..add('feedbackType', feedbackType)
          ..add('outcome', outcome)
          ..add('note', note)
          ..add('createdAt', createdAt))
        .toString();
  }
}

class FeedbackWithDetailsBuilder
    implements Builder<FeedbackWithDetails, FeedbackWithDetailsBuilder> {
  _$FeedbackWithDetails? _$v;

  int? _id;
  int? get id => _$this._id;
  set id(int? id) => _$this._id = id;

  int? _analysisId;
  int? get analysisId => _$this._analysisId;
  set analysisId(int? analysisId) => _$this._analysisId = analysisId;

  String? _instrument;
  String? get instrument => _$this._instrument;
  set instrument(String? instrument) => _$this._instrument = instrument;

  int? _userId;
  int? get userId => _$this._userId;
  set userId(int? userId) => _$this._userId = userId;

  String? _userEmail;
  String? get userEmail => _$this._userEmail;
  set userEmail(String? userEmail) => _$this._userEmail = userEmail;

  FeedbackWithDetailsFeedbackTypeEnum? _feedbackType;
  FeedbackWithDetailsFeedbackTypeEnum? get feedbackType => _$this._feedbackType;
  set feedbackType(FeedbackWithDetailsFeedbackTypeEnum? feedbackType) =>
      _$this._feedbackType = feedbackType;

  FeedbackWithDetailsOutcomeEnum? _outcome;
  FeedbackWithDetailsOutcomeEnum? get outcome => _$this._outcome;
  set outcome(FeedbackWithDetailsOutcomeEnum? outcome) =>
      _$this._outcome = outcome;

  String? _note;
  String? get note => _$this._note;
  set note(String? note) => _$this._note = note;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  FeedbackWithDetailsBuilder() {
    FeedbackWithDetails._defaults(this);
  }

  FeedbackWithDetailsBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _analysisId = $v.analysisId;
      _instrument = $v.instrument;
      _userId = $v.userId;
      _userEmail = $v.userEmail;
      _feedbackType = $v.feedbackType;
      _outcome = $v.outcome;
      _note = $v.note;
      _createdAt = $v.createdAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(FeedbackWithDetails other) {
    _$v = other as _$FeedbackWithDetails;
  }

  @override
  void update(void Function(FeedbackWithDetailsBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  FeedbackWithDetails build() => _build();

  _$FeedbackWithDetails _build() {
    final _$result = _$v ??
        _$FeedbackWithDetails._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'FeedbackWithDetails', 'id'),
          analysisId: BuiltValueNullFieldError.checkNotNull(
              analysisId, r'FeedbackWithDetails', 'analysisId'),
          instrument: BuiltValueNullFieldError.checkNotNull(
              instrument, r'FeedbackWithDetails', 'instrument'),
          userId: BuiltValueNullFieldError.checkNotNull(
              userId, r'FeedbackWithDetails', 'userId'),
          userEmail: BuiltValueNullFieldError.checkNotNull(
              userEmail, r'FeedbackWithDetails', 'userEmail'),
          feedbackType: BuiltValueNullFieldError.checkNotNull(
              feedbackType, r'FeedbackWithDetails', 'feedbackType'),
          outcome: outcome,
          note: note,
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'FeedbackWithDetails', 'createdAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
