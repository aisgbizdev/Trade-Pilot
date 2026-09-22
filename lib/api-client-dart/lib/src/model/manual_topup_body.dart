//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'manual_topup_body.g.dart';

/// ManualTopupBody
///
/// Properties:
/// * [userId] 
/// * [amountRupiah] - Not constrained to the fixed packages — admins can grant any amount/credits pair to resolve a top-up support case (e.g. a payment confirmed outside the app after proof upload failed).
/// * [credits] 
/// * [note] - Required audit trail — this bypasses the normal proof-upload verification entirely, so the reason must be recorded.
@BuiltValue()
abstract class ManualTopupBody implements Built<ManualTopupBody, ManualTopupBodyBuilder> {
  @BuiltValueField(wireName: r'userId')
  int get userId;

  /// Not constrained to the fixed packages — admins can grant any amount/credits pair to resolve a top-up support case (e.g. a payment confirmed outside the app after proof upload failed).
  @BuiltValueField(wireName: r'amountRupiah')
  int get amountRupiah;

  @BuiltValueField(wireName: r'credits')
  int get credits;

  /// Required audit trail — this bypasses the normal proof-upload verification entirely, so the reason must be recorded.
  @BuiltValueField(wireName: r'note')
  String get note;

  ManualTopupBody._();

  factory ManualTopupBody([void updates(ManualTopupBodyBuilder b)]) = _$ManualTopupBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(ManualTopupBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<ManualTopupBody> get serializer => _$ManualTopupBodySerializer();
}

class _$ManualTopupBodySerializer implements PrimitiveSerializer<ManualTopupBody> {
  @override
  final Iterable<Type> types = const [ManualTopupBody, _$ManualTopupBody];

  @override
  final String wireName = r'ManualTopupBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    ManualTopupBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'userId';
    yield serializers.serialize(
      object.userId,
      specifiedType: const FullType(int),
    );
    yield r'amountRupiah';
    yield serializers.serialize(
      object.amountRupiah,
      specifiedType: const FullType(int),
    );
    yield r'credits';
    yield serializers.serialize(
      object.credits,
      specifiedType: const FullType(int),
    );
    yield r'note';
    yield serializers.serialize(
      object.note,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    ManualTopupBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required ManualTopupBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'userId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.userId = valueDes;
          break;
        case r'amountRupiah':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.amountRupiah = valueDes;
          break;
        case r'credits':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.credits = valueDes;
          break;
        case r'note':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.note = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  ManualTopupBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = ManualTopupBodyBuilder();
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

