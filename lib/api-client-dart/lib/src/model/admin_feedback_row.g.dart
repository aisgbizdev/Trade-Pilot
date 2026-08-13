// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'admin_feedback_row.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const AdminFeedbackRowFeedbackTypeEnum
    _$adminFeedbackRowFeedbackTypeEnum_useful =
    const AdminFeedbackRowFeedbackTypeEnum._('useful');
const AdminFeedbackRowFeedbackTypeEnum
    _$adminFeedbackRowFeedbackTypeEnum_notUseful =
    const AdminFeedbackRowFeedbackTypeEnum._('notUseful');

AdminFeedbackRowFeedbackTypeEnum _$adminFeedbackRowFeedbackTypeEnumValueOf(
    String name) {
  switch (name) {
    case 'useful':
      return _$adminFeedbackRowFeedbackTypeEnum_useful;
    case 'notUseful':
      return _$adminFeedbackRowFeedbackTypeEnum_notUseful;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<AdminFeedbackRowFeedbackTypeEnum>
    _$adminFeedbackRowFeedbackTypeEnumValues = BuiltSet<
        AdminFeedbackRowFeedbackTypeEnum>(const <AdminFeedbackRowFeedbackTypeEnum>[
  _$adminFeedbackRowFeedbackTypeEnum_useful,
  _$adminFeedbackRowFeedbackTypeEnum_notUseful,
]);

const AdminFeedbackRowOutcomeEnum _$adminFeedbackRowOutcomeEnum_correct =
    const AdminFeedbackRowOutcomeEnum._('correct');
const AdminFeedbackRowOutcomeEnum _$adminFeedbackRowOutcomeEnum_wrong =
    const AdminFeedbackRowOutcomeEnum._('wrong');
const AdminFeedbackRowOutcomeEnum _$adminFeedbackRowOutcomeEnum_unknown =
    const AdminFeedbackRowOutcomeEnum._('unknown');

AdminFeedbackRowOutcomeEnum _$adminFeedbackRowOutcomeEnumValueOf(String name) {
  switch (name) {
    case 'correct':
      return _$adminFeedbackRowOutcomeEnum_correct;
    case 'wrong':
      return _$adminFeedbackRowOutcomeEnum_wrong;
    case 'unknown':
      return _$adminFeedbackRowOutcomeEnum_unknown;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<AdminFeedbackRowOutcomeEnum>
    _$adminFeedbackRowOutcomeEnumValues =
    BuiltSet<AdminFeedbackRowOutcomeEnum>(const <AdminFeedbackRowOutcomeEnum>[
  _$adminFeedbackRowOutcomeEnum_correct,
  _$adminFeedbackRowOutcomeEnum_wrong,
  _$adminFeedbackRowOutcomeEnum_unknown,
]);

Serializer<AdminFeedbackRowFeedbackTypeEnum>
    _$adminFeedbackRowFeedbackTypeEnumSerializer =
    _$AdminFeedbackRowFeedbackTypeEnumSerializer();
Serializer<AdminFeedbackRowOutcomeEnum>
    _$adminFeedbackRowOutcomeEnumSerializer =
    _$AdminFeedbackRowOutcomeEnumSerializer();

class _$AdminFeedbackRowFeedbackTypeEnumSerializer
    implements PrimitiveSerializer<AdminFeedbackRowFeedbackTypeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'useful': 'useful',
    'notUseful': 'not_useful',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'useful': 'useful',
    'not_useful': 'notUseful',
  };

  @override
  final Iterable<Type> types = const <Type>[AdminFeedbackRowFeedbackTypeEnum];
  @override
  final String wireName = 'AdminFeedbackRowFeedbackTypeEnum';

  @override
  Object serialize(
          Serializers serializers, AdminFeedbackRowFeedbackTypeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  AdminFeedbackRowFeedbackTypeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      AdminFeedbackRowFeedbackTypeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$AdminFeedbackRowOutcomeEnumSerializer
    implements PrimitiveSerializer<AdminFeedbackRowOutcomeEnum> {
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
  final Iterable<Type> types = const <Type>[AdminFeedbackRowOutcomeEnum];
  @override
  final String wireName = 'AdminFeedbackRowOutcomeEnum';

  @override
  Object serialize(Serializers serializers, AdminFeedbackRowOutcomeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  AdminFeedbackRowOutcomeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      AdminFeedbackRowOutcomeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$AdminFeedbackRow extends AdminFeedbackRow {
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
  final AdminFeedbackRowFeedbackTypeEnum feedbackType;
  @override
  final AdminFeedbackRowOutcomeEnum? outcome;
  @override
  final String? note;
  @override
  final DateTime createdAt;

  factory _$AdminFeedbackRow(
          [void Function(AdminFeedbackRowBuilder)? updates]) =>
      (AdminFeedbackRowBuilder()..update(updates))._build();

  _$AdminFeedbackRow._(
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
  AdminFeedbackRow rebuild(void Function(AdminFeedbackRowBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AdminFeedbackRowBuilder toBuilder() =>
      AdminFeedbackRowBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AdminFeedbackRow &&
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
    return (newBuiltValueToStringHelper(r'AdminFeedbackRow')
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

class AdminFeedbackRowBuilder
    implements Builder<AdminFeedbackRow, AdminFeedbackRowBuilder> {
  _$AdminFeedbackRow? _$v;

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

  AdminFeedbackRowFeedbackTypeEnum? _feedbackType;
  AdminFeedbackRowFeedbackTypeEnum? get feedbackType => _$this._feedbackType;
  set feedbackType(AdminFeedbackRowFeedbackTypeEnum? feedbackType) =>
      _$this._feedbackType = feedbackType;

  AdminFeedbackRowOutcomeEnum? _outcome;
  AdminFeedbackRowOutcomeEnum? get outcome => _$this._outcome;
  set outcome(AdminFeedbackRowOutcomeEnum? outcome) =>
      _$this._outcome = outcome;

  String? _note;
  String? get note => _$this._note;
  set note(String? note) => _$this._note = note;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(DateTime? createdAt) => _$this._createdAt = createdAt;

  AdminFeedbackRowBuilder() {
    AdminFeedbackRow._defaults(this);
  }

  AdminFeedbackRowBuilder get _$this {
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
  void replace(AdminFeedbackRow other) {
    _$v = other as _$AdminFeedbackRow;
  }

  @override
  void update(void Function(AdminFeedbackRowBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AdminFeedbackRow build() => _build();

  _$AdminFeedbackRow _build() {
    final _$result = _$v ??
        _$AdminFeedbackRow._(
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'AdminFeedbackRow', 'id'),
          analysisId: BuiltValueNullFieldError.checkNotNull(
              analysisId, r'AdminFeedbackRow', 'analysisId'),
          instrument: BuiltValueNullFieldError.checkNotNull(
              instrument, r'AdminFeedbackRow', 'instrument'),
          userId: BuiltValueNullFieldError.checkNotNull(
              userId, r'AdminFeedbackRow', 'userId'),
          userEmail: BuiltValueNullFieldError.checkNotNull(
              userEmail, r'AdminFeedbackRow', 'userEmail'),
          feedbackType: BuiltValueNullFieldError.checkNotNull(
              feedbackType, r'AdminFeedbackRow', 'feedbackType'),
          outcome: outcome,
          note: note,
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'AdminFeedbackRow', 'createdAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
