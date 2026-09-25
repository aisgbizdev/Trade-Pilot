//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'delete_topup_response.g.dart';

/// DeleteTopupResponse
///
/// Properties:
/// * [id] 
/// * [creditsReversed] - Credits clawed back from the user (0 if the request was never approved).
/// * [creditBalance] - The user's credit balance after any reversal.
@BuiltValue()
abstract class DeleteTopupResponse implements Built<DeleteTopupResponse, DeleteTopupResponseBuilder> {
  @BuiltValueField(wireName: r'id')
  int get id;

  /// Credits clawed back from the user (0 if the request was never approved).
  @BuiltValueField(wireName: r'creditsReversed')
  int get creditsReversed;

  /// The user's credit balance after any reversal.
  @BuiltValueField(wireName: r'creditBalance')
  int get creditBalance;

  DeleteTopupResponse._();

  factory DeleteTopupResponse([void updates(DeleteTopupResponseBuilder b)]) = _$DeleteTopupResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(DeleteTopupResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<DeleteTopupResponse> get serializer => _$DeleteTopupResponseSerializer();
}

class _$DeleteTopupResponseSerializer implements PrimitiveSerializer<DeleteTopupResponse> {
  @override
  final Iterable<Type> types = const [DeleteTopupResponse, _$DeleteTopupResponse];

  @override
  final String wireName = r'DeleteTopupResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    DeleteTopupResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(int),
    );
    yield r'creditsReversed';
    yield serializers.serialize(
      object.creditsReversed,
      specifiedType: const FullType(int),
    );
    yield r'creditBalance';
    yield serializers.serialize(
      object.creditBalance,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    DeleteTopupResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required DeleteTopupResponseBuilder result,
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
        case r'creditsReversed':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.creditsReversed = valueDes;
          break;
        case r'creditBalance':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.creditBalance = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  DeleteTopupResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = DeleteTopupResponseBuilder();
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

