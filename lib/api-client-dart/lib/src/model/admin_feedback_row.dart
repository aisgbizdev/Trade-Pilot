//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'admin_feedback_row.g.dart';

/// AdminFeedbackRow
///
/// Properties:
/// * [id] 
/// * [analysisId] 
/// * [instrument] 
/// * [userId] 
/// * [userEmail] 
/// * [feedbackType] 
/// * [outcome] 
/// * [note] 
/// * [createdAt] 
@BuiltValue()
abstract class AdminFeedbackRow implements Built<AdminFeedbackRow, AdminFeedbackRowBuilder> {
  @BuiltValueField(wireName: r'id')
  int get id;

  @BuiltValueField(wireName: r'analysisId')
  int get analysisId;

  @BuiltValueField(wireName: r'instrument')
  String get instrument;

  @BuiltValueField(wireName: r'userId')
  int get userId;

  @BuiltValueField(wireName: r'userEmail')
  String get userEmail;

  @BuiltValueField(wireName: r'feedbackType')
  AdminFeedbackRowFeedbackTypeEnum get feedbackType;
  // enum feedbackTypeEnum {  useful,  not_useful,  };

  @BuiltValueField(wireName: r'outcome')
  AdminFeedbackRowOutcomeEnum? get outcome;
  // enum outcomeEnum {  correct,  wrong,  unknown,  };

  @BuiltValueField(wireName: r'note')
  String? get note;

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  AdminFeedbackRow._();

  factory AdminFeedbackRow([void updates(AdminFeedbackRowBuilder b)]) = _$AdminFeedbackRow;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AdminFeedbackRowBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AdminFeedbackRow> get serializer => _$AdminFeedbackRowSerializer();
}

class _$AdminFeedbackRowSerializer implements PrimitiveSerializer<AdminFeedbackRow> {
  @override
  final Iterable<Type> types = const [AdminFeedbackRow, _$AdminFeedbackRow];

  @override
  final String wireName = r'AdminFeedbackRow';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AdminFeedbackRow object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(int),
    );
    yield r'analysisId';
    yield serializers.serialize(
      object.analysisId,
      specifiedType: const FullType(int),
    );
    yield r'instrument';
    yield serializers.serialize(
      object.instrument,
      specifiedType: const FullType(String),
    );
    yield r'userId';
    yield serializers.serialize(
      object.userId,
      specifiedType: const FullType(int),
    );
    yield r'userEmail';
    yield serializers.serialize(
      object.userEmail,
      specifiedType: const FullType(String),
    );
    yield r'feedbackType';
    yield serializers.serialize(
      object.feedbackType,
      specifiedType: const FullType(AdminFeedbackRowFeedbackTypeEnum),
    );
    if (object.outcome != null) {
      yield r'outcome';
      yield serializers.serialize(
        object.outcome,
        specifiedType: const FullType(AdminFeedbackRowOutcomeEnum),
      );
    }
    if (object.note != null) {
      yield r'note';
      yield serializers.serialize(
        object.note,
        specifiedType: const FullType(String),
      );
    }
    yield r'createdAt';
    yield serializers.serialize(
      object.createdAt,
      specifiedType: const FullType(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AdminFeedbackRow object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AdminFeedbackRowBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.id = valueDes;
          break;
        case r'analysisId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.analysisId = valueDes;
          break;
        case r'instrument':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.instrument = valueDes;
          break;
        case r'userId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.userId = valueDes;
          break;
        case r'userEmail':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.userEmail = valueDes;
          break;
        case r'feedbackType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(AdminFeedbackRowFeedbackTypeEnum),
          ) as AdminFeedbackRowFeedbackTypeEnum;
          result.feedbackType = valueDes;
          break;
        case r'outcome':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(AdminFeedbackRowOutcomeEnum),
          ) as AdminFeedbackRowOutcomeEnum?;
          if (valueDes == null) continue;
          result.outcome = valueDes;
          break;
        case r'note':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.note = valueDes;
          break;
        case r'createdAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.createdAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AdminFeedbackRow deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AdminFeedbackRowBuilder();
    final serializedList = (serialized as Iterable<Object?>).toList();
    final unhandled = <Object?>[];
    _deserializeProperties(
      serializers,
      serialized,
      specifiedType: specifiedType,
      serializedList: serializedList,
      unhandled: unhandled,
      result: result,
    );
    return result.build();
  }
}

class AdminFeedbackRowFeedbackTypeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'useful')
  static const AdminFeedbackRowFeedbackTypeEnum useful = _$adminFeedbackRowFeedbackTypeEnum_useful;
  @BuiltValueEnumConst(wireName: r'not_useful')
  static const AdminFeedbackRowFeedbackTypeEnum notUseful = _$adminFeedbackRowFeedbackTypeEnum_notUseful;

  static Serializer<AdminFeedbackRowFeedbackTypeEnum> get serializer => _$adminFeedbackRowFeedbackTypeEnumSerializer;

  const AdminFeedbackRowFeedbackTypeEnum._(String name): super(name);

  static BuiltSet<AdminFeedbackRowFeedbackTypeEnum> get values => _$adminFeedbackRowFeedbackTypeEnumValues;
  static AdminFeedbackRowFeedbackTypeEnum valueOf(String name) => _$adminFeedbackRowFeedbackTypeEnumValueOf(name);
}

class AdminFeedbackRowOutcomeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'correct')
  static const AdminFeedbackRowOutcomeEnum correct = _$adminFeedbackRowOutcomeEnum_correct;
  @BuiltValueEnumConst(wireName: r'wrong')
  static const AdminFeedbackRowOutcomeEnum wrong = _$adminFeedbackRowOutcomeEnum_wrong;
  @BuiltValueEnumConst(wireName: r'unknown')
  static const AdminFeedbackRowOutcomeEnum unknown = _$adminFeedbackRowOutcomeEnum_unknown;

  static Serializer<AdminFeedbackRowOutcomeEnum> get serializer => _$adminFeedbackRowOutcomeEnumSerializer;

  const AdminFeedbackRowOutcomeEnum._(String name): super(name);

  static BuiltSet<AdminFeedbackRowOutcomeEnum> get values => _$adminFeedbackRowOutcomeEnumValues;
  static AdminFeedbackRowOutcomeEnum valueOf(String name) => _$adminFeedbackRowOutcomeEnumValueOf(name);
}

