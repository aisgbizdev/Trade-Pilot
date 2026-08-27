// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'feedback.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const FeedbackFeedbackTypeEnum _$feedbackFeedbackTypeEnum_useful =
    const FeedbackFeedbackTypeEnum._('useful');
const FeedbackFeedbackTypeEnum _$feedbackFeedbackTypeEnum_notUseful =
    const FeedbackFeedbackTypeEnum._('notUseful');

FeedbackFeedbackTypeEnum _$feedbackFeedbackTypeEnumValueOf(String name) {
  switch (name) {
    case 'useful':
      return _$feedbackFeedbackTypeEnum_useful;
    case 'notUseful':
      return _$feedbackFeedbackTypeEnum_notUseful;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<FeedbackFeedbackTypeEnum> _$feedbackFeedbackTypeEnumValues =
    BuiltSet<FeedbackFeedbackTypeEnum>(const <FeedbackFeedbackTypeEnum>[
  _$feedbackFeedbackTypeEnum_useful,
  _$feedbackFeedbackTypeEnum_notUseful,
]);

const FeedbackOutcomeEnum _$feedbackOutcomeEnum_correct =
    const FeedbackOutcomeEnum._('correct');
const FeedbackOutcomeEnum _$feedbackOutcomeEnum_wrong =
    const FeedbackOutcomeEnum._('wrong');
const FeedbackOutcomeEnum _$feedbackOutcomeEnum_unknown =
    const FeedbackOutcomeEnum._('unknown');

FeedbackOutcomeEnum _$feedbackOutcomeEnumValueOf(String name) {
  switch (name) {
    case 'correct':
      return _$feedbackOutcomeEnum_correct;
    case 'wrong':
      return _$feedbackOutcomeEnum_wrong;
    case 'unknown':
      return _$feedbackOutcomeEnum_unknown;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<FeedbackOutcomeEnum> _$feedbackOutcomeEnumValues =
    BuiltSet<FeedbackOutcomeEnum>(const <FeedbackOutcomeEnum>[
  _$feedbackOutcomeEnum_correct,
  _$feedbackOutcomeEnum_wrong,
  _$feedbackOutcomeEnum_unknown,
]);

Serializer<FeedbackFeedbackTypeEnum> _$feedbackFeedbackTypeEnumSerializer =
    _$FeedbackFeedbackTypeEnumSerializer();
Serializer<FeedbackOutcomeEnum> _$feedbackOutcomeEnumSerializer =
    _$FeedbackOutcomeEnumSerializer();

class _$FeedbackFeedbackTypeEnumSerializer
    implements PrimitiveSerializer<FeedbackFeedbackTypeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'useful': 'useful',
    'notUseful': 'not_useful',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'useful': 'useful',
    'not_useful': 'notUseful',
  };

  @override
  final Iterable<Type> types = const <Type>[FeedbackFeedbackTypeEnum];
  @override
  final String wireName = 'FeedbackFeedbackTypeEnum';

  @override
  Object serialize(Serializers serializers, FeedbackFeedbackTypeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  FeedbackFeedbackTypeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      FeedbackFeedbackTypeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$FeedbackOutcomeEnumSerializer
    implements PrimitiveSerializer<FeedbackOutcomeEnum> {
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
  final Iterable<Type> types = const <Type>[FeedbackOutcomeEnum];
  @override
  final String wireName = 'FeedbackOutcomeEnum';

  @override
  Object serialize(Serializers serializers, FeedbackOutcomeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  FeedbackOutcomeEnum deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      FeedbackOutcomeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$Feedback extends Feedback {
  @override
  final int id;
  @override
  final int analysisId;
  @override
  final FeedbackFeedbackTypeEnum feedbackType;
  @override
  final FeedbackOutcomeEnum? outcome;
  @override
  final String? note;
  @override
  final DateTime createdAt;

  factory _$Feedback([void Function(FeedbackBuilder)? updates]) =>
      (FeedbackBuilder()..update(updates))._build();

  _$Feedback._(
      {required this.id,
      required this.analysisId,
      required this.feedbackType,
      this.outcome,
      this.note,
      required this.createdAt})
      : super._();
  @override
  Feedback rebuild(void Function(FeedbackBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  FeedbackBuilder toBuilder() => FeedbackBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Feedback &&
        id == other.id &&
        analysisId == other.analysisId &&
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
    _$hash = $jc(_$hash, feedbackType.hashCode);
    _$hash = $jc(_$hash, outcome.hashCode);
    _$hash = $jc(_$hash, note.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'Feedback')
          ..add('id', id)
          ..add('analysisId', analysisId)
          ..add('feedbackType', feedbackType)
          ..add('outcome', outcome)
          ..add('note', note)
          ..add('createdAt', createdAt))
        .toString();
  }
}

class FeedbackBuilder implements Builder<Feedback, FeedbackBuilder> {
  _$Feedback? _$v;

  int? _id;
  int? get id => _$this._id;
  set id(int? id) => _$this._id = id;

  int? _analysisId;
  int? get analysisId => _$this._analysisId;
  set analysisId(int? analysisId) => _$this._analysisId = analysisId;

  FeedbackFeedbackTypeEnum? _feedbackType;
  FeedbackFeedbackTypeEnum? get feedbackType => _$this._feedbackType;
  set feedbackType(FeedbackFeedbackTypeEnum? feedbackType) =>
      _$this._feedbackType = feedbackType;

  FeedbackOutcomeEnum? _outcome;
  FeedbackOutcomeEnum? get outcome => _$this._outcome;
  set outcome(FeedbackOutcomeEnum? outcome) => _$this._outcome = outcome;

  String? _note;
  String? get note => _$this._note;
  set note(String? note) => _$this._note = note;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  FeedbackBuilder() {
    Feedback._defaults(this);
  }

  FeedbackBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _analysisId = $v.analysisId;
      _feedbackType = $v.feedbackType;
      _outcome = $v.outcome;
      _note = $v.note;
      _createdAt = $v.createdAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(Feedback other) {
    _$v = other as _$Feedback;
  }

  @override
  void update(void Function(FeedbackBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  Feedback build() => _build();

  _$Feedback _build() {
    final _$result = _$v ??
        _$Feedback._(
          id: BuiltValueNullFieldError.checkNotNull(id, r'Feedback', 'id'),
          analysisId: BuiltValueNullFieldError.checkNotNull(
              analysisId, r'Feedback', 'analysisId'),
          feedbackType: BuiltValueNullFieldError.checkNotNull(
              feedbackType, r'Feedback', 'feedbackType'),
          outcome: outcome,
          note: note,
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'Feedback', 'createdAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
