// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'feedback_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const FeedbackBodyFeedbackTypeEnum _$feedbackBodyFeedbackTypeEnum_useful =
    const FeedbackBodyFeedbackTypeEnum._('useful');
const FeedbackBodyFeedbackTypeEnum _$feedbackBodyFeedbackTypeEnum_notUseful =
    const FeedbackBodyFeedbackTypeEnum._('notUseful');

FeedbackBodyFeedbackTypeEnum _$feedbackBodyFeedbackTypeEnumValueOf(
    String name) {
  switch (name) {
    case 'useful':
      return _$feedbackBodyFeedbackTypeEnum_useful;
    case 'notUseful':
      return _$feedbackBodyFeedbackTypeEnum_notUseful;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<FeedbackBodyFeedbackTypeEnum>
    _$feedbackBodyFeedbackTypeEnumValues =
    BuiltSet<FeedbackBodyFeedbackTypeEnum>(const <FeedbackBodyFeedbackTypeEnum>[
  _$feedbackBodyFeedbackTypeEnum_useful,
  _$feedbackBodyFeedbackTypeEnum_notUseful,
]);

const FeedbackBodyOutcomeEnum _$feedbackBodyOutcomeEnum_correct =
    const FeedbackBodyOutcomeEnum._('correct');
const FeedbackBodyOutcomeEnum _$feedbackBodyOutcomeEnum_wrong =
    const FeedbackBodyOutcomeEnum._('wrong');
const FeedbackBodyOutcomeEnum _$feedbackBodyOutcomeEnum_unknown =
    const FeedbackBodyOutcomeEnum._('unknown');

FeedbackBodyOutcomeEnum _$feedbackBodyOutcomeEnumValueOf(String name) {
  switch (name) {
    case 'correct':
      return _$feedbackBodyOutcomeEnum_correct;
    case 'wrong':
      return _$feedbackBodyOutcomeEnum_wrong;
    case 'unknown':
      return _$feedbackBodyOutcomeEnum_unknown;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<FeedbackBodyOutcomeEnum> _$feedbackBodyOutcomeEnumValues =
    BuiltSet<FeedbackBodyOutcomeEnum>(const <FeedbackBodyOutcomeEnum>[
  _$feedbackBodyOutcomeEnum_correct,
  _$feedbackBodyOutcomeEnum_wrong,
  _$feedbackBodyOutcomeEnum_unknown,
]);

Serializer<FeedbackBodyFeedbackTypeEnum>
    _$feedbackBodyFeedbackTypeEnumSerializer =
    _$FeedbackBodyFeedbackTypeEnumSerializer();
Serializer<FeedbackBodyOutcomeEnum> _$feedbackBodyOutcomeEnumSerializer =
    _$FeedbackBodyOutcomeEnumSerializer();

class _$FeedbackBodyFeedbackTypeEnumSerializer
    implements PrimitiveSerializer<FeedbackBodyFeedbackTypeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'useful': 'useful',
    'notUseful': 'not_useful',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'useful': 'useful',
    'not_useful': 'notUseful',
  };

  @override
  final Iterable<Type> types = const <Type>[FeedbackBodyFeedbackTypeEnum];
  @override
  final String wireName = 'FeedbackBodyFeedbackTypeEnum';

  @override
  Object serialize(Serializers serializers, FeedbackBodyFeedbackTypeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  FeedbackBodyFeedbackTypeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      FeedbackBodyFeedbackTypeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$FeedbackBodyOutcomeEnumSerializer
    implements PrimitiveSerializer<FeedbackBodyOutcomeEnum> {
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
  final Iterable<Type> types = const <Type>[FeedbackBodyOutcomeEnum];
  @override
  final String wireName = 'FeedbackBodyOutcomeEnum';

  @override
  Object serialize(Serializers serializers, FeedbackBodyOutcomeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  FeedbackBodyOutcomeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      FeedbackBodyOutcomeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$FeedbackBody extends FeedbackBody {
  @override
  final FeedbackBodyFeedbackTypeEnum feedbackType;
  @override
  final FeedbackBodyOutcomeEnum? outcome;
  @override
  final String? note;

  factory _$FeedbackBody([void Function(FeedbackBodyBuilder)? updates]) =>
      (FeedbackBodyBuilder()..update(updates))._build();

  _$FeedbackBody._({required this.feedbackType, this.outcome, this.note})
      : super._();
  @override
  FeedbackBody rebuild(void Function(FeedbackBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  FeedbackBodyBuilder toBuilder() => FeedbackBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is FeedbackBody &&
        feedbackType == other.feedbackType &&
        outcome == other.outcome &&
        note == other.note;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, feedbackType.hashCode);
    _$hash = $jc(_$hash, outcome.hashCode);
    _$hash = $jc(_$hash, note.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'FeedbackBody')
          ..add('feedbackType', feedbackType)
          ..add('outcome', outcome)
          ..add('note', note))
        .toString();
  }
}

class FeedbackBodyBuilder
    implements Builder<FeedbackBody, FeedbackBodyBuilder> {
  _$FeedbackBody? _$v;

  FeedbackBodyFeedbackTypeEnum? _feedbackType;
  FeedbackBodyFeedbackTypeEnum? get feedbackType => _$this._feedbackType;
  set feedbackType(FeedbackBodyFeedbackTypeEnum? feedbackType) =>
      _$this._feedbackType = feedbackType;

  FeedbackBodyOutcomeEnum? _outcome;
  FeedbackBodyOutcomeEnum? get outcome => _$this._outcome;
  set outcome(FeedbackBodyOutcomeEnum? outcome) => _$this._outcome = outcome;

  String? _note;
  String? get note => _$this._note;
  set note(String? note) => _$this._note = note;

  FeedbackBodyBuilder() {
    FeedbackBody._defaults(this);
  }

  FeedbackBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _feedbackType = $v.feedbackType;
      _outcome = $v.outcome;
      _note = $v.note;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(FeedbackBody other) {
    _$v = other as _$FeedbackBody;
  }

  @override
  void update(void Function(FeedbackBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  FeedbackBody build() => _build();

  _$FeedbackBody _build() {
    final _$result = _$v ??
        _$FeedbackBody._(
          feedbackType: BuiltValueNullFieldError.checkNotNull(
              feedbackType, r'FeedbackBody', 'feedbackType'),
          outcome: outcome,
          note: note,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
